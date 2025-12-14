// app.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker enregistré avec succès:', registration);
      })
      .catch(error => {
        console.error('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

// service-worker.js
const pathDirectory = '/Content/img/LR/';
const CACHE_NAME = 'hero-images-v1';
const IMAGE_URLS = [
    'hero-product-A.webp',
    'hero-product-B.webp',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert et fichiers mis en cache');
                return cache.addAll(pathDirectory + 'IMAGE_URLS);
            })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes(pathDirectory)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) return response;
                  
                    return fetch(event.request).then(
                        networkResponse => {
                            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                                return networkResponse;
                            }
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return networkResponse;
                        }
                    );
                })
        );
    }
});
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (cacheWhitelist.indexOf(name) === -1) {
                        return caches.delete(name); 
                    }
                })
            );
        })
    );
});
