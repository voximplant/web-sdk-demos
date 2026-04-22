<script setup lang="ts">
import '@voximplant/spaceui/common/сommon.css';
import '@voximplant/spaceui/dist/spaceui.css';
import { DefaultLayout } from './layout';
import { NotificationManager } from '@voximplant/spaceui';
</script>

<template>
  <NotificationManager />
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100dvh;
  background: #f4f5f7;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
}

#app {
  display: contents;
}

@media all and (display-mode: standalone),
  all and (display-mode: minimal-ui),
  all and (display-mode: window-controls-overlay) {
  html,
  body {
    background: #fff;
    min-height: 100dvh;
  }
}
</style>
