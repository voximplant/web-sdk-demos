<template>
  <div class="numpad">
    <UiRow>
      <NumpadButton :value="'1'" :disabled="props.disabled" @press="emitPress" />
      <NumpadButton
        value="2"
        long-press-value="ABC"
        :disabled="props.disabled"
        @press="emitPress"
      />
      <NumpadButton
        value="3"
        long-press-value="DEF"
        :disabled="props.disabled"
        @press="emitPress"
      />
    </UiRow>
    <UiRow>
      <NumpadButton
        value="4"
        long-press-value="GHI"
        :disabled="props.disabled"
        @press="emitPress"
      />
      <NumpadButton
        value="5"
        long-press-value="JKL"
        :disabled="props.disabled"
        @press="emitPress"
      />
      <NumpadButton
        value="6"
        long-press-value="MNO"
        :disabled="props.disabled"
        @press="emitPress"
      />
    </UiRow>
    <UiRow>
      <NumpadButton
        value="7"
        long-press-value="PQRS"
        :disabled="props.disabled"
        @press="emitPress"
      />
      <NumpadButton
        value="8"
        long-press-value="TUV"
        :disabled="props.disabled"
        @press="emitPress"
      />
      <NumpadButton
        value="9"
        long-press-value="WXYZ"
        :disabled="props.disabled"
        @press="emitPress"
      />
    </UiRow>
    <UiRow>
      <NumpadButton value="*" :disabled="props.disabled" @press="emitPress" />
      <NumpadButton long-press-value="+" value="0" :disabled="props.disabled" @press="emitPress" />
      <NumpadButton :value="'#'" :disabled="props.disabled" @press="emitPress" />
    </UiRow>
  </div>
</template>

<script setup lang="ts">
import NumpadButton from './NumpadButton.vue';
import UiRow from './UiRow.vue';
const emit = defineEmits<{
  (e: 'press', value: string, options: { mode: 'add' | 'replace' }): void;
}>();

const emitPress = (value: string, isReseted: boolean): void => {
  emit('press', value, { mode: isReseted ? 'add' : 'replace' });
};

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false });
</script>

<style scoped>
.numpad {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
