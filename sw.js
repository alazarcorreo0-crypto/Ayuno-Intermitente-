// Service Worker - Ayuno 14:10
const CACHE = "ayuno-v1";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/db.js",
  "./js/utils.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // No cachear peticiones a CDNs externos (Chart.js, idb)
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
