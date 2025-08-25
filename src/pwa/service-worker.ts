// Service worker implementing basic offline caching
declare const self: ServiceWorkerGlobalScope;

const CACHE = 'snakes-letters-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/196.png',
  '/icons/512.png',
  '/dictionary/english.txt',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request)),
  );
});
