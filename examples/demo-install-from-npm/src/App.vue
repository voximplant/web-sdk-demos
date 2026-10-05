<script setup lang="ts">
import { ref } from 'vue';
import { Core } from '@voximplant/websdk';
import { StreamLoader, streamToken } from '@voximplant/websdk/modules/stream';

// SDK features are available after the core is initialized.
const websdk = Core.init();

// Optional modules come from @voximplant/websdk/modules/* and must be registered before use.
// This example registers Stream. Other modules are listed in the README.
websdk.registerModules([StreamLoader()]);

// getModule returns undefined when the token was not registered.
// Stream is registered above, so the non-null assertion is safe.
const streamModule = websdk.getModule(streamToken)!;

const cameraPermission = ref(streamModule.hardware.permission.camera.value);
const microphonePermission = ref(streamModule.hardware.permission.microphone.value);

streamModule.hardware.permission.camera.watch((nextPermission) => {
  cameraPermission.value = nextPermission;
});

streamModule.hardware.permission.microphone.watch((nextPermission) => {
  microphonePermission.value = nextPermission;
});

</script>

<template>
  <main class="page">
    <h1 class="title">WebSDK from npm</h1>

    <section class="card">
      <p class="label">Camera permission</p>
      <p class="permission"> {{ cameraPermission }}</p>
    </section>

    <section class="card">
      <p class="label">Microphone permission</p>
      <p class="permission">{{ microphonePermission }}</p>
    </section>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  background: #f4f6f8;
  color: #1a1a1a;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.card {
  width: 100%;
  max-width: 20rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.label {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  color: #5f6b7a;
}

.permission {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

</style>
