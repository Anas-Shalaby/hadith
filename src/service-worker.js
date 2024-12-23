const CACHE_NAME = 'hadith-encyclopedia-v1';
const OFFLINE_URL = '/index.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/index.css',
  '/src/main.jsx',
  '/src/App.jsx'
];

const EXTERNAL_ASSETS = [
  'https://hadeethenc.com/api/v1/hadeeths/one/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate worker immediately
});

// Rest of the code remains the same...

// Push notification with updated icon
self.addEventListener('push', (event) => {
  const title = 'حديث جديد';
  const options = {
    body: 'لقد تم إضافة حديث جديد إلى التطبيق',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});