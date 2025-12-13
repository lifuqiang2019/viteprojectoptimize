import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// Custom plugin to inject prefetch links for async chunks associated with routes
function prefetchPlugin() {
  return {
    name: 'vite-plugin-prefetch',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      const chunks = Object.values(ctx.bundle)
        .filter(chunk => chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.css'));

      // Filter out entry chunk to avoid double loading (browser handles entry)
      // Prefetch remaining chunks (e.g. from lazy loaded routes)
      const prefetchTags = chunks
        .filter(chunk => !chunk.isEntry)
        .map(chunk => `<link rel="prefetch" href="/${chunk.fileName}" />`)
        .join('\n    ');

      return html.replace('</head>', `\n    ${prefetchTags}\n  </head>`);
    }
  }
}

export default defineConfig({
  // Base path for production
  base: '/',
  plugins: [
    vue(),
    visualizer({ open: true }),

    // Gzip Compression
    viteCompression({
      algorithm: 'gzip',
      deleteOriginFile: false,
      threshold: 10240 // Only compress > 10kb
    }),

    // PWA Configuration
    VitePWA({ 
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Vite Admin Demo',
        short_name: 'ViteAdmin',
        description: 'Vite Admin Demo with PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // 10MB
      }
    }),

    // Custom Prefetch
    prefetchPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Specific Heavy Libs (Lazy loaded via route usually, but if shared, split out)
            if (id.includes('echarts')) {
              return 'echarts';
            }
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('monaco-editor')) {
              return 'monaco';
            }
            if (id.includes('vue-pdf-embed')) {
              return 'pdf';
            }
            if (id.includes('mockjs')) {
              return 'mock';
            }
            
            // Put everything else into a single vendor chunk to avoid circular dependencies
            // between framework (vue) and UI libraries (element-plus)
            return 'vendor';
          }
        }
      }
    }
  }
})
