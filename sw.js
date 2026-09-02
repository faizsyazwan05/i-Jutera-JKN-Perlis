const CACHE_NAME = 'pwa-jkn-perlis-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// 1. Proses Pemasangan (Install) - Simpan fail penting ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Proses Pengaktifan (Activate) - Bersihkan cache lama jika versi bertukar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Memadam cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Proses Pengambilan (Fetch) - Gunakan cache jika tiada internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Jika ada dalam cache, pulangkan cache. Jika tiada, ambil dari internet.
        return response || fetch(event.request);
      })
  );
});
