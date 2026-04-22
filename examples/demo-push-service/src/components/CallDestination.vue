<template>
  <div class="call-destination">
    <Typography fontType="header" fontSize="700">{{ callDestination }}</Typography>
  </div>
</template>

<script setup lang="ts">
import { currentCall } from '@/store';
import { Typography } from '@voximplant/spaceui';
import { computed } from 'vue';

const callDestination = computed(() => {
  return currentCall.value?.destination ?? 'unknown';
});

defineOptions({ name: 'CallDestination' });
</script>

<style scoped>
.call-destination {
  text-align: center;
}
</style>
