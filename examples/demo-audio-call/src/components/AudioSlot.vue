<template>
  <div class="audio-slot">
    <span ref="slotRef"></span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, toRefs } from 'vue';
import { type AudioRenderer, type RemoteStream } from '@voximplant/websdk/modules/stream';
import { websdk } from '@/service/websdk';

interface Props {
  stream: RemoteStream;
}

const props = defineProps<Props>();
const { stream } = toRefs(props);
const audioElement = ref<HTMLAudioElement | null>(null);
const slotRef = ref<HTMLDivElement>();
const renderer = ref<AudioRenderer | null>(null);

onMounted(async () => {
  renderer.value = websdk.rendererManager.createAudioRenderer(stream.value);
  audioElement.value = renderer.value.getElement();
  if (audioElement.value) {
    slotRef.value?.appendChild(audioElement.value);
  }
});
</script>

<style scoped></style>
