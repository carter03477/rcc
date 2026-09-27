const CACHE_NAME = 'rcc-v22';
const urlsToCache = [
  './',
  './index.html',
  './data.json',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install service worker and cache the app shell for offline use.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Take control quickly and remove old RCC caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('rcc-')) {
            return caches.delete(cacheName);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Offline strategy:
// - Page navigations fall back to cached index.html.
// - Static assets use cache first, then network, then cached index for safety.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.ok && event.request.url.startsWith(self.location.origin)) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return caches.match('./index.html');
        });
    })
  );
});
