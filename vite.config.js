import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// Custom plugin to inject prefetch links for async chunks associated with routes
// Strategy: Delayed Prefetch to avoid LCP impact
function prefetchPlugin() {
  return {
    name: 'vite-plugin-prefetch',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;

      const chunks = Object.values(ctx.bundle)
        .filter(chunk => chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.css'))
        .filter(chunk => !chunk.isEntry);

      // Construct prefetch link tags
      const links = chunks.map(chunk => {
        return `<link rel="prefetch" href="/${chunk.fileName}" />`
      }).join('');
      
      // Inject script to append links after load
      // Using requestIdleCallback for better performance
      const script = `
        <script>
          window.addEventListener('load', () => {
            const prefetchLinks = '${links}';
            const requestIdleCallback = window.requestIdleCallback || (cb => setTimeout(cb, 2000));
            
            requestIdleCallback(() => {
              setTimeout(() => {
                const head = document.getElementsByTagName('head')[0];
                const div = document.createElement('div');
                div.innerHTML = prefetchLinks;
                Array.from(div.children).forEach(link => head.appendChild(link));
                console.log('Prefetch links injected');
              }, 2000); // 2s delay after idle to ensure LCP is done
            });
          });
        </script>
      `;

      return html.replace('</body>', `${script}\n  </body>`);
    }
  }
}

export default defineConfig({
  // Base path for production
  base: '/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
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
