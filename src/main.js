import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'GET_SW_INFO' })
        }
        if (registration.active) {
          registration.active.postMessage({ type: 'GET_SW_INFO' })
        }
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing
          if (installing) {
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Service worker updated')
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('Service worker registration failed', error)
      })
  })

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_INFO') {
      const { version, scope, cacheName, enabledCache } = event.data
      console.log('Service worker info', { version, scope, cacheName, enabledCache })
    }
  })
}
