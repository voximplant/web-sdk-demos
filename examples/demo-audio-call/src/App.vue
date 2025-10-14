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
body {
  margin: 0;
  padding: 0;
}
</style>
