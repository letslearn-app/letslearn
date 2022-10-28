self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("letslearn")
      .then((cache) =>
        cache.addAll([
          "./assets/default-ad53eec0.css",
          "./assets/common-40c724d0.css",
          "./assets/dark-58dfb0c7.css",
          "./index.js",
          "./index.html",
        ])
      )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
