
const CACHE_NAME = "ninho-v1";

const ARQUIVOS_INICIAIS = [
  "./",
  "./index.html"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_INICIAIS);
    })
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") {
    return;
  }

  evento.respondWith(
    fetch(evento.request).catch(() => {
      return caches.match(evento.request);
    })
  );
});
