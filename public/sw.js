const SW_VERSION = '1.0.0'
const CACHE_PREFIX = 'vite-admin'
const ENABLE_CACHE = self.location.hostname !== 'localhost'
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${SW_VERSION}`

const sendInfoToClients = async () => {
  const clientsList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
  const info = {
    type: 'SW_INFO',
    version: SW_VERSION,
    scope: self.registration.scope,
    cacheName: RUNTIME_CACHE,
    enabledCache: ENABLE_CACHE,
  }
  clientsList.forEach((client) => client.postMessage(info))
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  if (!ENABLE_CACHE) {
    return
  }
  event.waitUntil(caches.open(RUNTIME_CACHE))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
      await sendInfoToClients()
    })()
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_SW_INFO') {
    sendInfoToClients()
  }
})

self.addEventListener('fetch', (event) => {
  if (!ENABLE_CACHE || event.request.method !== 'GET') {
    return
  }
  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) {
    return
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE)
      const cached = await cache.match(event.request)
      if (cached) {
        return cached
      }
      const response = await fetch(event.request)
      if (response && response.status === 200) {
        cache.put(event.request, response.clone())
      }
      return response
    })()
  )
})
