// cache resources by service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/pwa/index.html',
                '/pwa/assets/css/skeleton.css',
                '/pwa/assets/js/app.js'
            ]);
        })
    );
});

// handle client requests: get from cache, load by the request or catch if did not match any
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            // get from cache
            if (resp) {
                let headersCopy = new Headers(resp.headers);
                headersCopy.set('x-service-worker', 'true');

                return resp.arrayBuffer().then(buffer => {
                    return new Response(buffer, {
                        status    : resp.status,
                        statusText: resp.statusText,
                        headers   : headersCopy
                    });
                });
            }
            // get from network
            return fetch(event.request).then(response => {
                let responseClone = response.clone();
                caches.open('v1').then(cache => {
                    cache.put(event.request, responseClone);
                });

                return response;
            });
        }).catch(() => {
            return caches.match('/pwa/index.html');
        })
    );
});