// Overall Purpose:
// This service worker script is designed to enhance the web application by
// enabling offline functionality and improving loading performance.
// It achieves this by caching essential application assets (like HTML, CSS, JavaScript, and images)
// when the user first visits. Subsequent visits can then load these assets directly from the cache,
// leading to faster load times and allowing the application to work even without a network connection.
// The service worker intercepts network requests and serves cached responses when available,
// falling back to the network if a resource isn't cached. It also manages cache versions
// to ensure that users receive updated assets when the application is updated.

// Define the cache name
/**
 * @const {string} CACHE_NAME
 * @description The unique name for the cache storage.
 * This name is used to identify this specific cache among potentially other caches
 * stored by the browser for this origin.
 * Versioning (e.g., 'v1', 'v2') is important for cache management during updates.
 * When the service worker is updated with a new CACHE_NAME, old caches
 * can be identified and cleaned up during the 'activate' event.
 */
const CACHE_NAME = 'video-reverser-cache-v1';

/**
 * @const {string[]} urlsToCache
 * @description An array of URLs representing the core application shell assets
 * that should be pre-cached when the service worker is installed.
 * These files are essential for the basic functionality and appearance of the application.
 * Caching these ensures that the app can load a basic version even when offline.
 * Paths should be relative to the service worker's location or absolute paths.
 */
const urlsToCache = [
  './SSS-Encoder-Decoder/index.html', // Changed to index.html
  './SSS-Encoder-Decoder/manifest.json',
  './SSS-Encoder-Decoder/service-worker.js',
  // Ensure all icon paths are correct relative to the root
  //'./video-reverser/icons/icon-72x72.png',
  //'./video-reverser/icons/icon-96x96.png',
  //'./video-reverser/icons/icon-128x128.png',
  //'./video-reverser/icons/icon-144x144.png',
  //'./video-reverser/icons/icon-152x152.png',
  //'./video-reverser/icons/icon-192x192.png',
  //'./video-reverser/icons/icon-384x384.png',
  //'./video-reverser/icons/icon-512x512.png'
];

/**
 * @event install
 * @description This event is triggered when the service worker is first registered and installed.
 * Its primary purpose here is to pre-cache the essential static assets defined in `urlsToCache`.
 * By caching these resources during installation, the application can be used offline
 * and will load faster on subsequent visits.
 * `event.waitUntil()` is used to ensure the service worker doesn't complete installation
 * until the caching operations are finished. If any of the files fail to cache,
 * the installation process might fail.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

/**
 * @event fetch
 * @description This event is triggered for every network request made by the pages
 * controlled by this service worker (e.g., for HTML files, CSS, JavaScript, images).
 * It allows the service worker to intercept the request and decide how to respond.
 *
 * The strategy implemented here is "Cache First, then Network Fallback":
 * 1. Try to find a match for the request in the cache.
 * 2. If a cached response is found (cache hit), return it immediately. This provides offline access
 *    and fast loading for previously cached resources.
 * 3. If the request is not found in the cache (cache miss), then attempt to fetch it from the network.
 * 4. If the network fetch is successful (valid response, status 200, basic type):
 *    a. Clone the response: Responses are streams and can only be consumed once.
 *       It's cloned so one copy can be put into the cache and the other can be sent to the page.
 *    b. Open the cache and store the fetched response (key: request, value: cloned response).
 *       This ensures that future requests for the same resource can be served from the cache.
 *    c. Return the original network response to the page.
 * 5. If the network fetch fails or returns an invalid response, the original (failed) response is returned.
 *    (Error handling for fetch failures is also included, with a suggestion for a fallback page).
 */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // we can consume one in the cache and one in the browser.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // You can return a fallback page here for offline scenarios
        // For example: return caches.match('/offline.html');
      })
  );
});

/**
 * @event activate
 * @description This event is triggered when the service worker becomes active and takes control
 * of the pages it's scoped to. This typically happens after a new service worker has installed
 * and any older service worker is no longer controlling any clients.
 *
 * The primary purpose of this event handler is to manage caches, specifically to clean up
 * old, outdated caches. This is crucial for ensuring that when the application is updated
 * (e.g., with new assets or a new `CACHE_NAME`), users are not stuck with old cached files.
 *
 * The process is:
 * 1. Define a `cacheWhitelist` containing the name of the current, active cache (`CACHE_NAME`).
 * 2. Get a list of all cache names currently stored by the origin.
 * 3. Iterate through all cache names:
 *    a. If a cache name is not in the `cacheWhitelist`, it means it's an old cache.
 *    b. Delete the old cache using `caches.delete(cacheName)`.
 * `event.waitUntil()` ensures that the activation phase is extended until all old caches are deleted,
 * preventing potential conflicts between old and new cache versions.
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
