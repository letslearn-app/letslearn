self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("letslearn")
      .then((cache) =>
        cache.addAll([
          "./index.js",
          "./index.html",
        ])
      )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
