# Install Web SDK v5 from unpkg

A single HTML page that loads [Voximplant Web SDK v5](https://www.npmjs.com/package/@voximplant/websdk) from [unpkg](https://unpkg.com) and uses one optional module. There is no build step and no package install.

The SDK is split into a [core](https://voximplant.com/docs/references/websdk-v5/core) script and optional module scripts. Load the core, load only the modules you need, wait until those scripts finish, then initialize the core and register the modules.

## Add the SDK

Load the core and each module with a `script` tag. This example loads Stream:

```html
<script
  id="websdk-core-module"
  defer
  src="https://unpkg.com/@voximplant/websdk/index.min.js"
></script>
<script
  id="websdk-stream-module"
  defer
  src="https://unpkg.com/@voximplant/websdk/modules/stream/stream.min.js"
></script>
```

The scripts use `defer`, so wait for their `load` events before calling the SDK. unpkg exposes the SDK on the `Voximplant` global. Each module's loader and token live on that module's object, for example `Voximplant.Stream`:

```js
const {
  Core,
  Stream: { StreamLoader, streamToken },
} = Voximplant;

const websdk = await Core.init();
await websdk.registerModules([StreamLoader()]);

const stream = websdk.getModule(streamToken);
```

[Core.init()](https://voximplant.com/docs/references/websdk-v5/core/core#init) returns an [SDK instance](https://voximplant.com/docs/references/websdk-v5/core/core). Extra features are not loaded until you register them with [registerModules](https://voximplant.com/docs/references/websdk-v5/core/core#registermodules). [getModule](https://voximplant.com/docs/references/websdk-v5/core/core#getmodule) returns `undefined` if that module was not registered.

This example registers the [Stream](https://voximplant.com/docs/references/websdk-v5/stream) module and reads camera and microphone permission. Other modules follow the same pattern: add the script, then take the loader and token from the global:

| Module | Script | Global | Loader | Token |
| --- | --- | --- | --- | --- |
| [Stream](https://voximplant.com/docs/references/websdk-v5/stream) | `@voximplant/websdk/modules/stream/stream.min.js` | `Voximplant.Stream` | [StreamLoader](https://voximplant.com/docs/references/websdk-v5/stream/streamloader) | [streamToken](https://voximplant.com/docs/references/websdk-v5/stream/streamtoken) |
| [Call](https://voximplant.com/docs/references/websdk-v5/call) | `@voximplant/websdk/modules/call-manager/call-manager.min.js` | `Voximplant.CallManager` | [CallLoader](https://voximplant.com/docs/references/websdk-v5/call/callloader) | [callToken](https://voximplant.com/docs/references/websdk-v5/call/calltoken) |
| [Conference](https://voximplant.com/docs/references/websdk-v5/conference) | `@voximplant/websdk/modules/conference-manager/conference-manager.min.js` | `Voximplant.ConferenceManager` | [ConferenceLoader](https://voximplant.com/docs/references/websdk-v5/conference/conferenceloader) | [conferenceToken](https://voximplant.com/docs/references/websdk-v5/conference/conferencetoken) |
| [PushService](https://voximplant.com/docs/references/websdk-v5/pushservice) | `@voximplant/websdk/modules/push-service/push-service.min.js` | `Voximplant.PushService` | [PushServiceLoader](https://voximplant.com/docs/references/websdk-v5/pushservice/pushserviceloader) | [pushServiceToken](https://voximplant.com/docs/references/websdk-v5/pushservice/pushservicetoken) |
| [NoiseSuppressionBalanced](https://voximplant.com/docs/references/websdk-v5/noisesuppressionbalanced) | `@voximplant/websdk/modules/noise-suppression-balanced/noise-suppression-balanced.min.js` | `Voximplant.NoiseSuppressionBalanced` | [NoiseSuppressionBalancedLoader](https://voximplant.com/docs/references/websdk-v5/noisesuppressionbalanced/noisesuppressionbalancedloader) | [noiseSuppressionBalancedToken](https://voximplant.com/docs/references/websdk-v5/noisesuppressionbalanced/noisesuppressionbalancedtoken) |
| [NoiseSuppressionAggressive](https://voximplant.com/docs/references/websdk-v5/noisesuppressionaggressive) | `@voximplant/websdk/modules/noise-suppression-aggressive/noise-suppression-aggressive.min.js` | `Voximplant.NoiseSuppressionAggressive` | [NoiseSuppressionAggressiveLoader](https://voximplant.com/docs/references/websdk-v5/noisesuppressionaggressive/noisesuppressionaggressiveloader) | [noiseSuppressionAggressiveToken](https://voximplant.com/docs/references/websdk-v5/noisesuppressionaggressive/noisesuppressionaggressivetoken) |
| [SmartQueue](https://voximplant.com/docs/references/websdk-v5/smartqueue) | `@voximplant/websdk/modules/smart-queue/smart-queue.min.js` | `Voximplant.SmartQueue` | [SmartQueueLoader](https://voximplant.com/docs/references/websdk-v5/smartqueue/smartqueueloader) | [smartQueueToken](https://voximplant.com/docs/references/websdk-v5/smartqueue/smartqueuetoken) |

Prefix each script path with `https://unpkg.com/`. The page is [src/index.html](./src/index.html).

## Run this example

Requirements:

- A browser that supports top-level `await` and `Promise.withResolvers` (Chrome/Edge 119+, Firefox 121+, Safari 17.4+)

Open [src/index.html](./src/index.html) in that browser. The page shows the current camera and microphone permission from the [Stream](https://voximplant.com/docs/references/websdk-v5/stream) module.

## Resources

- [Getting started with the web platform](https://voximplant.com/docs/getting-started/platform/web)
- [Web SDK v5 reference](https://voximplant.com/docs/references/websdk-v5)
- [npm package @voximplant/websdk](https://www.npmjs.com/package/@voximplant/websdk)
- [Voximplant documentation](https://voximplant.com/docs)
