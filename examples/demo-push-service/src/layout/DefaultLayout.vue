<template>
  <div ref="appShellRef" class="app-shell">
    <IncomingCallManager />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IncomingCallManager } from '@/components';
import { useAppWindow } from '@/composables';

defineOptions({ name: 'DefaultLayout' });

const appShellRef = ref<HTMLElement | null>(null);

useAppWindow(appShellRef);
</script>

<style scoped>
.app-shell {
  /* Size is driven by rendered content; the window is resized to match
     (see useAppWindow.ts). */
  width: fit-content;
  height: fit-content;
  max-width: 100vw;
  max-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e7e7e7;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
}

.app-main {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: auto;
}

/* When installed as a PWA, the window is resized to match the shell, so drop
   the outer frame and let the shell fill the window edge-to-edge. */
@media all and (display-mode: standalone),
  all and (display-mode: minimal-ui),
  all and (display-mode: window-controls-overlay) {
  .app-shell {
    max-width: none;
    max-height: none;
    margin: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
