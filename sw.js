const CACHE_NAME = 'aegivis-v7-cache'; // 버전을 v7로 올려서 캐시 강제 갱신
const urlsToCache = [
  './index.html',
  './Aegivis_3_0_App_Final.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
        });
      })
  );
});

// 푸시 알림 수신 이벤트
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {
    title: '이지비스 긴급 알림',
    body: '새로운 현장 상황이 발생했습니다. 즉시 확인해 주세요!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png'
  };

  const options = {
    body: data.body,
    icon: data.icon || './icons/icon-192.png',
    badge: data.badge || './icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || './index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
