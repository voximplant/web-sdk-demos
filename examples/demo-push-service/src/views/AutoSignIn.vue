<template>
  <div class="auto-signin-container">
    <Spinner size="xl" />
  </div>
</template>

<script setup lang="ts">
import { loginWithStoredAccessToken } from '@/service/websdk';
import { Spinner } from '@voximplant/spaceui';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/constants';
import { connect } from '@/service/websdk';
import { node } from '@/store';
import type { ConnectionNode } from '@voximplant/websdk';

const router = useRouter();

onMounted(async () => {
  try {
    await connect(node.value as ConnectionNode);
    await loginWithStoredAccessToken();
    await router.push({ name: ROUTE_NAMES.MAIN });
  } catch (error) {
    console.error('Failed to login with stored access token', error);
    await router.push({ name: ROUTE_NAMES.SIGNIN });
  }
});
</script>

<style scoped>
.auto-signin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100vw;
}
</style>
