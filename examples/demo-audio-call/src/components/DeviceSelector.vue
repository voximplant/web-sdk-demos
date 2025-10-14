<template>
  <div class="device-selector">
    <Select
      class="device-selector-select"
      :modelValue="selectedMicrophone"
      :options="microphoneOptions"
      label="Microphone"
      placeholder="Microphone"
      @update:modelValue="updateSelectedMicrophone"
    />
    <Select
      class="device-selector-select"
      :modelValue="selectedSpeaker"
      :options="speakerOptions"
      label="Speaker"
      placeholder="Speaker"
      @update:modelValue="updateSelectedSpeaker"
    />
  </div>
</template>

<script setup lang="ts">
import { Select } from '@voximplant/spaceui';
import { computed } from 'vue';
import { websdk } from '@/service/websdk';
import { useReadonlyWatchable } from '@/composables';

defineOptions({ name: 'DeviceSelector' });

const selectedMicrophone = useReadonlyWatchable(websdk.deviceTracker.currentMicrophone);
const selectedSpeaker = useReadonlyWatchable(websdk.deviceTracker.currentSpeaker);

const microphones = useReadonlyWatchable(websdk.deviceTracker.microphones);
const speakers = useReadonlyWatchable(websdk.deviceTracker.speakers);

const microphoneOptions = computed(() => {
  return microphones.value.map((microphone) => ({
    label: microphone.label,
    value: microphone.id,
  }));
});

const speakerOptions = computed(() => {
  return speakers.value.map((speaker) => ({
    label: speaker.label,
    value: speaker.id,
  }));
});

const updateSelectedMicrophone = ({ value }: { value: string }): void => {
  const deviceId = value as string;
  const microphones = websdk.deviceTracker.microphones.value;
  const microphone = microphones.find((microphone) => microphone.id === deviceId);
  if (microphone) {
    websdk.deviceTracker.currentMicrophone.value = microphone;
  }
};

const updateSelectedSpeaker = ({ value }: { value: string }): void => {
  const deviceId = value as string;
  const speakers = websdk.deviceTracker.speakers.value;
  const speaker = speakers.find((speaker) => speaker.id === deviceId);
  if (speaker) {
    websdk.deviceTracker.currentSpeaker.value = speaker;
  }
};
</script>

<style scoped>
.device-selector {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.device-selector-select {
  margin-bottom: 0;
}
</style>
