<template>
  <Hint class="ui-button-hint" :text="hint">
    <Button class="ui-button" v-bind="props" @click="$emit('click')">
      <slot />
    </Button>
  </Hint>
</template>

<script setup lang="ts">
import { Button, Hint } from '@voximplant/spaceui';

defineOptions({ name: 'UiButton' });

const props = withDefaults(
  defineProps<{
    width?: 'fill-container' | 'fill-content';
    mode?: Button['mode'];
    icon?: string;
    size?: 's' | 'm' | 'l';
    hint?: string;
    disabled?: boolean;
    iconOnly?: boolean;
    hideText?: boolean;
  }>(),
  {
    width: 'fill-container',
    mode: 'primary',
    icon: '',
    size: 'm',
    hint: '',
    disabled: false,
    iconOnly: false,
    hideText: false,
  },
);

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style scoped>
.ui-button {
  min-height: 42px;
  max-height: 42px;
}
.ui-button-hint {
  width: unset;
}
</style>
