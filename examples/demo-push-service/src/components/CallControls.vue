<template>
  <div class="call-controls">
    <UiRow>
      <UiButton :icon="muteIcon" :hint="muteHint" mode="outlined" icon-only @click="onToggleMute" />
      <UiButton
        v-if="isCallAlive"
        class="hangup-button"
        hint="Hang up"
        mode="alert"
        icon="ic24-phone"
        icon-only
        @click="onHangup"
      />
      <UiButton v-else hint="Close" mode="alert" icon="ic24-close" icon-only @click="onHangup" />
      <UiButton
        :icon="holdIcon"
        :hint="holdHint"
        mode="outlined"
        :disabled="!canToggleHold"
        icon-only
        @click="onToggleHold"
      />
    </UiRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { currentCall } from '@/store/call';
import { toggleHold, hangupAndClear, toggleMute } from '@/service/websdk';
import { ROUTE_NAMES } from '@/constants';
import { UiRow, UiButton } from '@/components';
import { CallState } from '@voximplant/websdk/modules/call-manager';
import { useReadonlyWatchable } from '@/composables';

defineOptions({ name: 'CallControls' });

const router = useRouter();

const isMicrophoneMuted = computed(() => currentCall.value?.isMicrophoneMuted.value ?? false);
const muteIcon = computed(() => (isMicrophoneMuted.value ? 'ic24-mic-off' : 'ic24-mic'));
const muteHint = computed(() => {
  return isMicrophoneMuted.value ? 'Unmute microphone' : 'Mute microphone';
});

const callState = computed(() =>
  currentCall.value ? useReadonlyWatchable(currentCall.value.state).value : CallState.Created,
);

const isCallAlive = computed(
  () => ![CallState.Failed, CallState.Disconnected].includes(callState.value),
);

const canToggleHold = computed(() => CallState.Connected === callState.value);

const holdHint = computed(() => {
  return currentCall.value?.isOnHold.value ? 'Unhold call' : 'Hold call';
});

const holdIcon = computed(() => {
  return currentCall.value?.isOnHold.value ? 'ic24-play' : 'ic24-pause';
});

const onToggleHold = async (): Promise<void> => {
  await toggleHold();
};

const onHangup = async (): Promise<void> => {
  await hangupAndClear();
  router.replace({ name: ROUTE_NAMES.MAIN });
};

const onToggleMute = async (): Promise<void> => {
  await toggleMute();
};
</script>

<style scoped>
.call-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: -8px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.hangup-button :deep(svg) {
  transform: rotate(135deg);
}
</style>
