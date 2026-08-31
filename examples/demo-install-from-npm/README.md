# Install Web SDK v5 from npm

A minimal Vue 3 app that adds [Voximplant Web SDK v5](https://www.npmjs.com/package/@voximplant/websdk) with npm and uses one optional module.

The SDK is split into a [core](https://voximplant.com/docs/references/websdk-v5/core) and optional modules. You install one package, initialize the core, then register only the modules your app needs.

## Add the SDK

Install the package:

```sh
npm install @voximplant/websdk
```

Initialize the core, register a module, and get it by token:

```ts
import { Core } from '@voximplant/websdk';
import { StreamLoader, streamToken } from '@voximplant/websdk/modules/stream';

const websdk = Core.init();
websdk.registerModules([StreamLoader()]);

const stream = websdk.getModule(streamToken);
```

[Core.init()](https://voximplant.com/docs/references/websdk-v5/core/core#init) returns an [SDK instance](https://voximplant.com/docs/references/websdk-v5/core/core). Extra features are not loaded until you register them with [registerModules](https://voximplant.com/docs/references/websdk-v5/core/core#registermodules). Import each module from `@voximplant/websdk/modules/<name>` and pass its loader to [registerModules](https://voximplant.com/docs/references/websdk-v5/core/core#registermodules). [getModule](https://voximplant.com/docs/references/websdk-v5/core/core#getmodule) returns `undefined` if that module was not registered.

This example registers the [Stream](https://voximplant.com/docs/references/websdk-v5/stream) module and reads camera and microphone permission. Other modules follow the same pattern:

| Module | Import path | Loader | Token |
| --- | --- | --- | --- |
| [Stream](https://voximplant.com/docs/references/websdk-v5/stream) | `@voximplant/websdk/modules/stream` | `StreamLoader` | `streamToken` |
| [Call](https://voximplant.com/docs/references/websdk-v5/call) | `@voximplant/websdk/modules/call-manager` | `CallLoader` | `callToken` |
| [Conference](https://voximplant.com/docs/references/websdk-v5/conference) | `@voximplant/websdk/modules/conference-manager` | `ConferenceLoader` | `conferenceToken` |
| [PushService](https://voximplant.com/docs/references/websdk-v5/pushservice) | `@voximplant/websdk/modules/push-service` | `PushServiceLoader` | `pushServiceToken` |
| [NoiseSuppressionBalanced](https://voximplant.com/docs/references/websdk-v5/noisesuppressionbalanced) | `@voximplant/websdk/modules/noise-suppression-balanced` | `NoiseSuppressionBalancedLoader` | `noiseSuppressionBalancedToken` |
| [NoiseSuppressionAggressive](https://voximplant.com/docs/references/websdk-v5/noisesuppressionaggressive) | `@voximplant/websdk/modules/noise-suppression-aggressive` | `NoiseSuppressionAggressiveLoader` | `noiseSuppressionAggressiveToken` |
| [SmartQueue](https://voximplant.com/docs/references/websdk-v5/smartqueue) | `@voximplant/websdk/modules/smart-queue` | `SmartQueueLoader` | `smartQueueToken` |

The SDK setup lives in [`src/App.vue`](./src/App.vue).

## Run this example

Requirements:

- [Node.js](https://nodejs.org) 20.19.0 or 22.12.0 and later
- [Yarn](https://yarnpkg.com) 4 (this example ships Yarn via `packageManager`)

```sh
cd examples/demo-install-from-npm
yarn install
yarn dev
```

Open `http://localhost:5173`. The page shows the current camera and microphone permission from the [Stream](https://voximplant.com/docs/references/websdk-v5/stream) module.

## Resources

- [Getting started with the web platform](https://voximplant.com/docs/getting-started/platform/web)
- [Web SDK v5 reference](https://voximplant.com/docs/references/websdk-v5)
- [npm package `@voximplant/websdk`](https://www.npmjs.com/package/@voximplant/websdk)
- [Voximplant documentation](https://voximplant.com/docs)
