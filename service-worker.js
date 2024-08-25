const CACHE_NAME = 'movie-quiz-cache-v1';
const urlsToCache = [
  '/movie-quiz-ain/',                // 루트 경로 수정
  '/movie-quiz-ain/index.html',      // 경로 수정
  '/movie-quiz-ain/css/styles.css',  // 경로 수정
  '/movie-quiz-ain/js/app.js',       // 경로 수정
  '/movie-quiz-ain/images/icons-192.png', // 경로 수정
  '/movie-quiz-ain/images/icons-512.png'  // 경로 수정
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

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
