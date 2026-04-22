# Voximplant WebSDK v5 examples

This repository contains a collection of ready-to-use example applications demonstrating 
the Voximplant Web SDK 5.x capabilities.

## Available demos

### [Audio Call Demo](./examples/demo-audio-call)

A fully-featured audio calling application built with Vue.js 3 and Voximplant Web SDK 5.x. 

**Key features:**

- Audio calls to Voximplant users, SIP addresses, and phone numbers
- User authentication with Voximplant credentials
- Audio device selection and management
- Call controls (mute, hold, hangup)
- DTMF sending support
- Incoming call management
- Call duration tracking

**Tech stack:** Vue.js 3, TypeScript, Vite, Vue Router, SpaceUI

### [Push Service Demo](./examples/demo-push-service)

Extends the [Audio Call Demo](./examples/demo-audio-call) with **Firebase Cloud Messaging (FCM) push notifications**, so incoming calls can wake the app up even if the tab is in the background or closed.

**Additional features (on top of the [Audio Call Demo](./examples/demo-audio-call)):**

- Push token registration with the Voximplant's `pushService` module
- Firebase Cloud Messaging (FCM) integration for foreground and background push delivery
- Service worker that handles push events and displays system notifications
- Auto sign-in with a stored access token when opening the app from a notification click
- PWA support via `vite-plugin-pwa` (installable app with manifest and icons)

**Tech stack:** Vue.js 3, TypeScript, Vite, Vue Router, SpaceUI, Firebase, vite-plugin-pwa

## Quick start

Each demo is self-contained and can run independently. To get started with any example:

1. Navigate to the example directory:
```sh
cd examples/<demo-name>
```
2. Install dependencies:
```sh
yarn install
```
3. Start the development server:
```sh
yarn dev
```

For detailed setup instructions, backend configuration, and customization options, refer to each example's individual README.

## Project structure

```text
websdk5-examples/
├── examples/
│   └── demo-audio-call/    # Audio calling demo application
│   └── demo-push-service/  # Audio calling demo with FCM push notifications
└── README.md               # This file
```

## Resources

- [Voximplant documentation](https://voximplant.com/docs/getting-started)
- [WebSDK v5 reference](https://voximplant.com/docs/references/websdk5)
- [Voximplant Control Panel](https://manage.voximplant.com)
- [VoxEngine scenarios](https://voximplant.com/docs/guides/calls/scenario)
