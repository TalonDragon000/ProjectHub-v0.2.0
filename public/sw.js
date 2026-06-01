const CACHE_NAME = 'project-hub-v0.5.1';

// On install, skip waiting so the new SW takes over immediately.
self.addEventListener('install', () => self.skipWaiting());

// On activate, delete all caches from previous versions.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first strategy: always try the network, fall back to cache.
// This ensures users always get fresh assets after a deploy.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
