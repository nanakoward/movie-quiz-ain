const CACHE_NAME = 'movie-quiz-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/images/icons-192.png',
  '/images/icons-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         return response || fetch(event.request);
//       })
//   );
// });
self.addEventListener('fetch', event => {
  event.respondWith(
      caches.match(event.request)
          .then(response => {
              return response || fetch(event.request).then(response => {
                  return caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, response.clone());
                      return response;
                  });
              });
          })
  );
});
