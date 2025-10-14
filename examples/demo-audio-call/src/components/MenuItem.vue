<template>
  <button type="button" class="menu-item" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'MenuItem' });

const emit = defineEmits<{
  click: [];
}>();

const onClick = (): void => {
  emit('click');
};
</script>

<style scoped>
.menu-item {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--sui-gray-900, #1a1a1a);
  font-size: 14px;
  line-height: 20px;
  transition: background-color 0.15s ease;
}

.menu-item:hover {
  background-color: var(--sui-gray-100, #f5f5f5);
}

.menu-item:active {
  background-color: var(--sui-gray-200, #e5e5e5);
}

.menu-item:focus-visible {
  outline: 2px solid var(--sui-purple-600);
  outline-offset: -2px;
}
</style>
