const CACHE = 'door-cache-v1';
const ASSETS = [
  '/door.html',
  '/door.js',
  '/door.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  // רשת תחילה, נפילה למטמון
  e.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
