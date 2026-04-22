<template>
  <Hint class="numpad-button-hint" :text="hint">
    <Button
      class="numpad-button"
      width="fill-container"
      mode="outlined"
      :class="{ disabled }"
      :disabled="disabled"
      @mousedown="startLongPress"
      @mouseup="endLongPress"
      @mouseleave="endLongPress"
      @touchstart="startLongPress"
      @touchend="endLongPress"
      @touchcancel="endLongPress"
      @click="handlePress"
    >
      <div class="button-content">
        <span class="short-press-value">{{ value }}</span>
        <span class="long-press-value">{{ longPressValue ?? '&nbsp;' }}</span>
      </div>
    </Button>
  </Hint>
</template>

<script setup lang="ts">
import { useLongPress } from '@/composables';
import { Button, Hint } from '@voximplant/spaceui';
import { computed } from 'vue';

interface Props {
  longPressValue?: string;
  value: string;
  duration?: number;
  disabled?: boolean;
}

interface Emits {
  (e: 'press', value: string, isReseted: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 500,
  disabled: false,
});

const emit = defineEmits<Emits>();

const { startLongPress, endLongPress, handlePress } = useLongPress({
  duration: props.duration,
  longPressValue: props.longPressValue,
  value: props.value,
  onPress: (value: string, isReseted: boolean) => emit('press', value, isReseted),
});

const hint = computed(() => {
  const withLongPressHint = `Short press to enter "${props.value}". Long press to enter "${props.longPressValue}"`;
  const withoutLongPressHint = `Press to enter "${props.value}"`;
  return props.longPressValue ? withLongPressHint : withoutLongPressHint;
});
</script>

<style scoped>
.numpad-button {
  min-height: 42px;
  max-height: 42px;
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.short-press-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 2px;
}

.long-press-value {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.7;
  line-height: 1;
  margin-top: -2px;
}

.numpad-button-hint {
  width: unset;
}
</style>
