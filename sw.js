const CACHE_NAME = 'aegivis-v3-cache-v2'; // 버전을 v2로 올려서 캐시 강제 갱신
const urlsToCache = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  // 새로운 서비스 워커가 설치될 때 이전 캐시를 즉시 대체하도록 설정
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // 이전 버전의 캐시를 모두 삭제
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시 반환, 없으면 네트워크 요청
        return response || fetch(event.request).catch(() => {
            // 오프라인이거나 에러 시 index.html 반환 시도
            return caches.match('./index.html');
        });
      })
  );
});
