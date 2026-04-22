// Version must stay in sync with the `firebase` package in package.json.
importScripts(
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js'
);

const logScope = '[FCM Background]'; // Firebase Cloud Messaging

// Obtain the values from the firebase console (https://console.firebase.google.com/)
firebase.initializeApp({
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  projectId: 'PROJECT_ID',
  storageBucket: 'STORAGE_BUCKET',
  messagingSenderId: 'MESSAGING_SENDER_ID',
  appId: 'APP_ID',
  measurementId: 'MEASUREMENT_ID',
});

const buildNotificationFromPayload = (payload) => {
  const title = 'Incoming call';
  let body = 'You have an incoming call. Click to open the app.';

  try {
    const raw = payload?.data?.voximplant;
    if (raw) {
      const remoteMessage = JSON.parse(raw);
      if (remoteMessage?.display_name) {
        body = `${remoteMessage.display_name} is calling you. Click to open the app.`;
      }
    }
  } catch (error) {
    console.warn(`${logScope} Failed to parse Voximplant payload`, error);
  }

  return { title, options: { body } };
};

const broadcastToWindowClients = async (message) => {
  const clientList = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  if (!clientList.length) {
    console.log(`${logScope} No foreground clients found, waiting 500ms`);
    await self.clients.claim();
    await new Promise((resolve) => setTimeout(resolve, 500));
    return broadcastToWindowClients(message);
  }

  for (const client of clientList) {
    client.postMessage(message);
  }
};

self.addEventListener(
  'push',
  (event) => {
    event.stopImmediatePropagation();

    let payload = {};
    if (event.data) {
      try {
        payload = event.data.json();
      } catch (error) {
        console.warn(`${logScope} Failed to parse push data`, error);
      }
    }

    console.log(`${logScope} Push event`, payload);

    const { title, options } = buildNotificationFromPayload(payload);

    event.waitUntil(self.registration.showNotification(title, options));

    broadcastToWindowClients({
      type: 'FCM_BACKGROUND_MESSAGE',
      payload,
    }).catch((error) => {
      console.warn(`${logScope} Failed to broadcast to clients`, error);
    });
  },
  true
);

firebase.messaging();

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const scopeUrl = new URL(self.registration.scope);

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const autoSignInUrl= new URL('/', scopeUrl);
        autoSignInUrl.hash = '#/auto-signin';

        if (!clientList.length && self.clients.openWindow) {
          return self.clients.openWindow(autoSignInUrl.href);
        }

        for (const client of clientList) {
          const clientUrl = new URL(client.url);
          const isUnderScope = scopeUrl.origin === clientUrl.origin;
          if (isUnderScope && 'focus' in client) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(autoSignInUrl.href);
        }
      })
  );
});
