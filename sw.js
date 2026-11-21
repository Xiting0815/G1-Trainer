/* Service Worker: macht die App offline nutzbar. Bei Änderungen VERSION erhöhen. */
const VERSION = 'g1-trainer-v12';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './js/app.js', './js/store.js', './js/generator.js', './js/animator.js', './js/keepawake.js', './js/dfb-info.js',
  './data/exercises-halle.js', './data/exercises-draussen.js', './data/exercises-funino.js', './data/exercises-extra.js', './data/exercises-verteilen.js',
  './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network-first mit 3 s Timeout (schwaches Hallen-WLAN), nur erfolgreiche Antworten cachen
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreSearch: true });
    const net = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; });
    try {
      if (!cached) return await net;
      return await Promise.race([net, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))]);
    } catch (err) {
      if (cached) return cached;
      if (req.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
