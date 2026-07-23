const CACHE_NAME = 'grademastery-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: 'GradeMastery', body: event.data.text() };
  }
  const title = payload.title || 'GradeMastery';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icon-192.png',
    badge: payload.badge || '/icon-192.png',
    data: { url: payload.url || '/app.html' },
    tag: payload.tag || 'grademastery-notification',
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/app.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/app.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
