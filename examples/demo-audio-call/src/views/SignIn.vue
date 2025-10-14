<template>
  <div class="signin-wrap">
    <div class="signin-card">
      <DialerHeader />

      <div class="signin-header">
        <Typography font-type="header" font-size="600">Sign in</Typography>
      </div>
      <div class="signin-form">
        <Input
          v-model="username"
          :disabled="signingIn"
          label="Login"
          placeholder="user@app.account.node.voximplant.com"
        />
        <Input
          v-model="password"
          :disabled="signingIn"
          label="Password"
          type="password"
          key="password"
          placeholder="user password"
        />
        <Select
          v-model:modelValue="selectedNode"
          :options="nodeOptions"
          :disabled="signingIn"
          label="Node"
          placeholder="Select node"
        />
        <UiButton
          mode="primary"
          width="fill-container"
          :disabled="canSignIn || signingIn"
          :loading="signingIn"
          @click="processLogin"
        >
          Sign in
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { username, password, node } from '@/store/user';
import {
  Input,
  Select,
  Typography,
  type DropdownOptionProps,
  useNotification,
} from '@voximplant/spaceui';
import { ClientState, ConnectionNode } from '@voximplant/websdk';
import { websdk, connect, login, disconnect } from '@/service/websdk';
import { useReadonlyWatchable } from '@/composables';
import { ROUTE_NAMES } from '@/constants';
import { UiButton, DialerHeader } from '@/components';

defineOptions({ name: 'SignInView' });

const router = useRouter();

const { notify } = useNotification();
const selectedNode = ref<DropdownOptionProps<ConnectionNode>>({
  label: node.value,
  value: node.value as ConnectionNode,
});

const nodeOptions = computed<DropdownOptionProps[]>(() =>
  Object.values(ConnectionNode).map((node) => ({ label: node, value: node })),
);

const canSignIn = computed(() => !username.value || !password.value || !node.value);

watch(
  () => selectedNode.value,
  (value: DropdownOptionProps<ConnectionNode>) => {
    node.value = value.value;
  },
);

const clientState = useReadonlyWatchable(websdk.core.client.state);

const signingIn = computed(() =>
  [ClientState.LoggedIn, ClientState.Connecting].includes(clientState.value),
);

const processLogin = async (): Promise<void> => {
  try {
    await connect(selectedNode.value.value as ConnectionNode);
    await login(username.value, password.value);
    router.push({ name: ROUTE_NAMES.MAIN });
  } catch (error) {
    notify({
      title: 'Login failed',
      text: (error as Error).message,
      type: 'error',
    });
    await disconnect();
  }
};
</script>

<style scoped>
.signin-wrap {
  flex: 1;
  display: grid;
  place-items: center;
}

.signin-card {
  width: 360px;
  max-width: 100%;
  border: 1px solid #e7e7e7;
  border-radius: 12px;
  padding: 0;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.signin-card > :not(:first-child) {
  padding: 0 20px;
}

.signin-card > :last-child {
  padding-bottom: 20px;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
