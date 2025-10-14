<template>
  <div class="dtmf">
    <div class="input-field-container">
      <Input
        class="input-field"
        v-model="tone"
        label="Send DTMF tones"
        placeholder="e.g. #1234"
        :disabled="!canSendTone"
      />
      <Hint class="hint" text="Send DTMF tones">
        <Button
          class="send-button"
          mode="outlined"
          width="fit-content"
          :disabled="!canSendTone"
          icon="ic24-upload"
          hide-text
          icon-only
          @click="onSendTone"
        />
      </Hint>
    </div>

    <Numpad @press="updateTone" :disabled="!canSendTone" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, useNotification, Hint } from '@voximplant/spaceui';
import { CallState } from '@voximplant/websdk/modules/call-manager';
import { sendDTMF } from '@/service/websdk';
import { currentCall } from '@/store/call';
import { Numpad } from '@/components';
import { useReadonlyWatchable } from '@/composables';

defineOptions({ name: 'DtmfInput' });

const callStatus = computed(() =>
  currentCall.value?.state
    ? useReadonlyWatchable(currentCall.value.state).value
    : CallState.Created,
);
const canSendTone = computed(() => callStatus.value === CallState.Connected);

const { notify } = useNotification();

const tone = ref('');

const onSendTone = async (): Promise<void> => {
  try {
    await sendDTMF(tone.value);
    tone.value = '';
  } catch (error) {
    notify({
      title: 'Error',
      text: (error as Error).message,
      type: 'error',
    });
  }
};

const updateTone = (value: string): void => {
  tone.value += value;
};

defineExpose({
  updateTone,
});
</script>

<style scoped>
.input-field :deep(.sui-disabled) {
  background: transparent !important;
  color: var(--sui-gray-400) !important;
  border: 1px solid var(--sui-gray-300) !important;
}

.input-field-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

.hint {
  width: unset;
}

.send-button {
  margin-bottom: 4px;
  max-height: 40px;
  min-height: 40px;
}
</style>
