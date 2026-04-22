<template>
  <div class="call-status-wrapper">
    <div v-if="!isConnected" class="status-header">
      <Typography fontSize="14px">{{ statusText }}</Typography>
    </div>

    <div v-if="failReason" class="fail-reason">
      <Typography fontSize="14px">{{ failReason }}</Typography>
    </div>

    <div v-if="isConnected" class="duration">
      <Typography fontSize="14px">{{ formattedDuration }}</Typography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CallState } from '@voximplant/websdk/modules/call-manager';
import { currentCall, callFailReason, callFailCode } from '@/store/call';
import { useReadonlyWatchable, useCallDuration } from '@/composables';
import { Typography } from '@voximplant/spaceui';

defineOptions({ name: 'CallStatus' });

const callState = computed(() =>
  currentCall.value ? useReadonlyWatchable(currentCall.value.state).value : CallState.Created,
);

const isConnected = computed(() => callState.value === CallState.Connected);
const callFailed = computed(() => callState.value === CallState.Failed);

const statusText = computed(() => {
  switch (callState.value) {
    case CallState.Created:
      return 'Creating call...';
    case CallState.Connecting:
      return 'Connecting...';
    case CallState.Connected:
      return 'Call Connected';
    case CallState.Reconnecting:
      return 'Reconnecting...';
    case CallState.Disconnecting:
      return 'Hanging up...';
    case CallState.Disconnected:
      return 'Call ended';
    case CallState.Failed:
      return 'Call failed';
    default:
      return 'Unknown status';
  }
});

const failReason = computed(() => {
  if (callFailed.value && callFailReason.value) {
    if (callFailCode.value) {
      return `${callFailReason.value} (Code: ${callFailCode.value})`;
    }
    return callFailReason.value;
  }
  return '';
});

const formattedDuration = useCallDuration(currentCall.value);
</script>

<style scoped>
.call-status-wrapper {
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.duration {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}
</style>
