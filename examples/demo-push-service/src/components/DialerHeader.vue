<template>
  <div class="dialer-header">
    <Typography font-type="header" font-weight="medium" font-size="600">Audio call</Typography>
    <span class="spacer" />
    <Typography v-if="isAuthenticated">{{ usernameToShow }}</Typography>
    <KebabMenu v-if="isAuthenticated">
      <MenuItem @click="onLogout">Sign out</MenuItem>
    </KebabMenu>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Typography } from '@voximplant/spaceui';
import { disconnect } from '@/service/websdk';
import { username, isAuthenticated } from '@/store';
import { computed } from 'vue';
import KebabMenu from './KebabMenu.vue';
import MenuItem from './MenuItem.vue';

interface Props {
  showLogout?: boolean;
}

defineOptions({ name: 'DialerHeader' });

withDefaults(defineProps<Props>(), {
  showLogout: true,
});

const usernameToShow = computed(() => username.value.split('@')[0]);

const router = useRouter();

const onLogout = async (): Promise<void> => {
  await disconnect();
  router.replace({ name: 'signin' });
};
</script>

<style scoped>
.dialer-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--sui-purple-600);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  color: #fff;
  gap: 8px;
}
.spacer {
  flex-grow: 1;
}
</style>
