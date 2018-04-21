let cacheName = 'v39';
let cacheFiles = [
  './',
              './index.html',
              './restaurant.html',
              './css/styles.css',
              './data/restaurants.json',
              './js/idb.js',
              './js/dbhelper.js',
              './js/main.js',
              './sw.js',
              './js/restaurant_info.js',
              './img/1.jpg',
              './img/2.jpg',
              './img/3.jpg',
              './img/4.jpg',
              './img/5.jpg',
              './img/6.jpg',
              './img/7.jpg',
              './img/8.jpg',
              './img/9.jpg',
              './img/10.jpg'
];


self.addEventListener('install', function(e){
    //console.log('[ServiceWorker] Installed');

    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            //console.log('Caching');
            return cache.addAll(cacheFiles);
        })
    )
})

self.addEventListener('activate', function(e){
    //console.log('[ServiceWorker] Activated');

    e.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(cacheNames.map(function(currentCacheName){
                if (currentCacheName !== cacheName) {
                    //console.log("[ServiceWorker] Removing Cached Files from", currentCacheName);
                    caches.delete(currentCacheName);
                }
            }))
        })
    )
})

self.addEventListener('fetch', function(e){
    //console.log('[ServiceWorker] Fetching', e.request.url);
    if(e.request.method === "GET"){
        e.respondWith(

            caches.open(cacheName).then(cache => {
                return cache.match(e.request).then(response => {
                    // Return response from cache if one exists, otherwise go to network
                    return (
                        response ||
                        fetch(e.request).then(response => {
                            cache.put(e.request, response.clone());
                            return response;
                        })
                        .catch(function (err) {
                            console.log("[ServiceWorker]Error fetching and caching", err);
                        })
                    );
                });
            })
        );
    }

})
