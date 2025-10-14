<template>
  <div class="app-shell">
    <IncomingCallManager />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { IncomingCallManager } from '@/components';

defineOptions({ name: 'DefaultLayout' });
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: hidden;
}

.app-main {
  flex: 1;
  display: flex;
}
</style>
