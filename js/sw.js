const CACHE_NAME = 'hidden-secrets-v1.0.0';
const urlsToCache = [
  '/',
  '/steganography.html',
  '/css/styles.css',
  '/css/base.css',
  '/css/animations.css',
  '/css/enhancements.css',
  '/css/video-demo.css',
  '/js/crypto.js',
  '/js/ui.js',
  '/js/fileHandler.js',
  '/js/embed.js',
  '/js/extract.js',
  '/js/scrollAnimation.js',
  '/js/enhancements.js',
  '/js/performance-fix.js',
  '/assets/fonts/Orbitron-Black.ttf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
