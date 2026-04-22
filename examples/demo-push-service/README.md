# Voximplant push service demo for Vue.js

A Vue.js 3 application that extends the [`demo-audio-call`](../demo-audio-call) with **Firebase Cloud Messaging (FCM) push notifications**, so incoming calls can wake up the app even when the tab is in the background or closed.

This demo only documents the push-specific pieces. For authentication, dialer UI, device selection, call controls, DTMF, VoxEngine scenario, and general architecture, see [`demo-audio-call`](../demo-audio-call/README.md).

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Firebase setup](#firebase-setup)
- [Voximplant setup](#voximplant-setup)
- [How it works](#how-it-works)
- [Troubleshooting](#troubleshooting)

## Features

Adds to the base [audio call demo](../demo-audio-call/README.md):

- **Push token registration** with the Voximplant `pushService` module
- **Firebase Cloud Messaging (FCM)** integration for foreground and background push delivery
- **Service worker** (`src/sw.ts`) that handles push events and displays system notifications when the tab is not focused
- **Auto sign-in** with a stored access token when the user opens the app from a notification click
- **PWA support** via `vite-plugin-pwa` (installable app with manifest and icons)

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org) v20.19.0 or v22.12.0+
- [Yarn](https://yarnpkg.com) package manager
- A Voximplant account with an application, user, and push credentials registered in the Control Panel
- A Firebase project with Cloud Messaging enabled

### Installation

1. Navigate to the demo directory:
    ```sh
    cd examples/demo-push-service
    ```
2. Copy the environment template and fill in the values (see [Firebase setup](#firebase-setup) and [Voximplant setup](#voximplant-setup)):
    ```sh
    cp .env.example .env
    ```
3. Install dependencies and start the dev server:
    ```sh
    yarn install
    yarn dev
    ```

The application is served at `http://localhost:5173`.

> Push notifications require a **secure context** (HTTPS or `localhost`). Pushes will not be delivered over plain HTTP on a remote host.

### Environment variables

The `.env` file expects the following keys (see `.env.example`):

```
# Firebase Cloud Messaging config
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Push token bundle id configured in the Voximplant Control Panel
VITE_VOXIMPLANT_BUNDLE_ID=
```

## Firebase setup

1. Create (or open) a project in the [Firebase console](https://console.firebase.google.com/).
2. Add a **Web app** to the project and copy its SDK config values into `.env` (the `VITE_FIREBASE_*` variables).
3. In **Project settings → Cloud Messaging**, generate a **Web Push certificate** (VAPID key pair) if one is not already present.
4. Upload the Firebase **Server key** / service account credentials to the Voximplant Control Panel so that Voximplant can deliver pushes to your Firebase project on incoming calls.

## Voximplant setup

The Voximplant application, user, and VoxEngine call scenario are identical to the audio call demo — follow the [Voximplant setup section of `demo-audio-call`](../demo-audio-call/README.md#voximplant-setup).

In addition, push delivery requires:

1. Registering your Firebase push credentials in the Voximplant Control Panel.
2. Creating a **push token group** and putting its id into `VITE_VOXIMPLANT_BUNDLE_ID`. Every token registered via `pushService.registerPushToken({ token, bundleId })` is bound to this group.
3. Update VoxEngine scenario by adding the Push Service module
   ```require(Modules.PushService);```

## How it works

### Integration layer

`src/service/websdk/core.ts` bootstraps the Web SDK and additionally registers the `PushServiceLoader`, exposing a `pushService` module on the shared `websdk` object:

```typescript
core.registerModules([StreamLoader(), CallLoader(), PushServiceLoader()]);
const pushService = core.getModule(pushServiceToken)!;
```

### Push bootstrap

`src/service/websdk/push/push.ts` contains `initPushService()`, called once from `src/main.ts`. The intended workflow is:

1. Initialize Firebase and obtain an FCM token on every app start.
2. Register the token with Voximplant:
    ```typescript
    await websdk.pushService.registerPushToken({ token, bundle: voximplantBundleId });
    ```
3. Subscribe to FCM **foreground** messages via `onMessage(messaging, ...)` and forward Voximplant payloads back into the SDK:
    ```typescript
    await websdk.pushService.handlePushNotification(parsedMessage);
    ```
4. Subscribe to FCM **background** messages via the service worker `message` channel (`FCM_BACKGROUND_MESSAGE`) and forward them through the same `handlePushNotification` call so the SDK can materialize the missed incoming call.
5. Show a native `Notification` for the incoming call; clicking it focuses the window and, if not authenticated, routes the user to the `auto-signin` view.

### Service worker

`src/sw.ts` is built with `vite-plugin-pwa` in `injectManifest` mode. It:

- Listens to `push` events, parses the payload, and shows a notification (with **Accept** / **Decline** actions when `type === 'incoming_call'`).
- Listens to `notificationclick` and focuses or opens a client window, forwarding the action (`accept` / `decline`) and `callId` back to the page via `postMessage`.
- Handles `pushsubscriptionchange` by notifying open clients so they can re-register the token.

### Auto sign-in from a notification

When a user clicks a push notification and the app is not authenticated, the router navigates to `AutoSignIn.vue`, which calls `loginWithStoredAccessToken()` (see `core.ts`). Access and refresh tokens are persisted in `localStorage` during the initial login and reused on subsequent launches.

### Key files

```
src/
├── main.ts                          # calls initPushService() on startup
├── sw.ts                            # service worker: push + notificationclick
└── service/
    └── websdk/
        ├── core.ts                  # registers PushServiceLoader
        └── push/
            ├── push.ts              # FCM init, token registration, handlers
            ├── push.config.ts       # Firebase + bundleId env wiring
            └── push.types.ts        # Voximplant push payload types
```

## Troubleshooting

**No FCM token is obtained**

- Make sure the site is served over HTTPS or from `localhost`.
- Verify every `VITE_FIREBASE_*` value in `.env` matches the Firebase Web app config.
- Ensure notifications are allowed for the origin in the browser settings.

**Token registration fails with Voximplant**

- Confirm `VITE_VOXIMPLANT_BUNDLE_ID` matches an existing push token group in the Control Panel.
- Confirm the user is logged in before `registerPushToken` is called (the demo calls it from `initPushService` after Firebase token retrieval; in a custom flow you must ensure the client is in the `LoggedIn` state).

**Push is received but no incoming call appears**

- Check that the payload contains a stringified `voximplant` field — only such messages are forwarded to `pushService.handlePushNotification(...)`.
- Verify that Firebase credentials uploaded to Voximplant are still valid and match the Firebase project generating the token.

**Service worker not updating**

- Hard-reload the page or unregister the worker via DevTools → Application → Service Workers, then reload. The demo uses `registerType: 'autoUpdate'` but during development `skipWaiting` may still require a reload.

For everything else (login failures, call failures, audio device issues, VoxEngine scenario problems), see the [troubleshooting section of `demo-audio-call`](../demo-audio-call/README.md#troubleshooting).

## Resources

- [`demo-audio-call`](../demo-audio-call) — base audio call demo this project extends
- [Voximplant Web SDK v5 reference](https://voximplant.com/docs/references/websdk-v5)
- [Firebase Cloud Messaging for Web](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Vite PWA plugin](https://vite-pwa-org.netlify.app/)
