<template>
  <div class="lobby-wrap">
    <div class="dialer">
      <DialerHeader />

      <div class="dialer-input">
        <Input
          label="Call destination"
          v-model="callDestination"
          placeholder="Call destination e.g. 15551234567 or username"
        />
        <Hint class="dialer-input-erase-button-hint" text="Erase the last digit">
          <Button
            class="dialer-input-erase-button"
            mode="outlined"
            width="fit-content"
            :disabled="!callDestination"
            icon="ic24-chevron-left"
            hide-text
            icon-only
            @click="eraseLastDigit"
          />
        </Hint>
      </div>

      <Numpad @press="press" />

      <div class="dialer-actions">
        <UiRow>
          <span class="dialer-actions-spacer" />

          <UiButton
            mode="success"
            width="fill-container"
            :disabled="!callDestination"
            icon="ic24-phone"
            hide-text
            icon-only
            @click="startCall"
          />
        </UiRow>
      </div>

      <Spoiler title="Devices">
        <DeviceSelector />
      </Spoiler>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Input, Button, Spoiler, Hint } from '@voximplant/spaceui';
import { Numpad, DeviceSelector, UiRow, UiButton, DialerHeader } from '@/components';
import { call } from '@/service/websdk';
import { callDestination } from '@/store/call';
import { ROUTE_NAMES } from '@/constants';

defineOptions({ name: 'MainView' });

const router = useRouter();

const press = (value: string, options: { mode: 'add' | 'replace' }): void => {
  const { mode } = options;
  if (mode === 'add') callDestination.value += value;
  if (mode === 'replace') {
    callDestination.value = callDestination.value.slice(0, -1) + value;
  }
};

const eraseLastDigit = (): void => {
  callDestination.value = callDestination.value.slice(0, -1);
};

const startCall = async (): Promise<void> => {
  await call();
  router.push({ name: ROUTE_NAMES.CALL });
};
</script>

<style scoped>
.lobby-wrap {
  flex: 1;
  display: grid;
  place-items: center;
}

.dialer {
  width: 360px;
  max-width: 100%;
  border: 1px solid #e7e7e7;
  border-radius: 16px;
  padding: 0;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.dialer > :not(:first-child) {
  padding: 0 20px;
}

.dialer > :last-child {
  padding-bottom: 20px;
}

.dialer-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 20px;
}

.dialer-actions {
  margin-top: -8px;
}

.call-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dialer-input-erase-button {
  margin-bottom: 4px;
  max-height: 40px;
  min-height: 40px;
}

.dialer-input-erase-button-hint {
  width: unset;
}
</style>
