self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
    e.waitUntil(
      caches.open('spleta-cache').then((cache) => {
        return cache.addAll([
          '/',
          'index.html',
          'style.css',
          'app.js',
          'localstorage-tasks.js',
          'manifest.json',
          'icons/icon-192.png',
          'icons/icon-512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((res) => {
        return res || fetch(e.request);
      })
    );
  });
  