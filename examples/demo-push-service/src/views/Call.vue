<template>
  <div class="call-wrap">
    <div class="call-card">
      <DialerHeader />

      <CallDestination />
      <CallStatus />
      <DtmfInput />

      <CallControls />
      <Spoiler title="Devices">
        <DeviceSelector />
      </Spoiler>

      <Teleport to="body">
        <AudioSlot v-if="remoteAudioStream" :stream="remoteAudioStream" />
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CallDestination,
  CallStatus,
  CallControls,
  DtmfInput,
  DeviceSelector,
  AudioSlot,
  DialerHeader,
} from '@/components';
import { currentCall } from '@/store/call';
import { ref, watchEffect } from 'vue';
import { StreamType, type RemoteStream } from '@voximplant/websdk/modules/stream';
import { Spoiler } from '@voximplant/spaceui';

defineOptions({ name: 'CallView' });

const remoteAudioStream = ref<RemoteStream | undefined>(undefined);

watchEffect(() => {
  if (currentCall.value) {
    currentCall.value.remoteStreams.watch((remoteStreams) => {
      remoteAudioStream.value = Array.from(remoteStreams).find(
        (stream) => stream.type === StreamType.Audio,
      );
    });
  }
});
</script>

<style scoped>
.call-wrap {
  flex: 1;
  display: grid;
  place-items: center;
}

.call-card {
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

.call-card > :not(:first-child) {
  padding: 0 20px;
}

.call-card > :last-child {
  padding-bottom: 20px;
}
</style>
