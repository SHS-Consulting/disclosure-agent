// Disclosure Agent PRO · Service Worker
// KI Taskforce · disclosure.kitaskforce.com
const CACHE = 'disclosure-pro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/cases.json',
  '/data/people.json',
  '/data/operations.json',
  '/data/congruence.json',
  '/data/debunked.json',
  '/data/strongest.json',
  '/assets/logo.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // API calls always go to network
  if (e.request.url.includes('api.anthropic.com')) return;
  
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && res.type !== 'opaque') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
