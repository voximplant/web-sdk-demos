<template>
  <div ref="menuRef" class="kebab-menu">
    <Button
      size="s"
      icon-only
      icon="ic24-more-ver"
      class="button"
      :class="{ active: isOpen }"
      @click="toggleMenu"
    ></Button>
    <Transition name="menu-fade">
      <div v-if="isOpen" class="dropdown" @click="handleMenuClick">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Button } from '@voximplant/spaceui';

defineOptions({ name: 'KebabMenu' });

const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const toggleMenu = (): void => {
  isOpen.value = !isOpen.value;
};

const closeMenu = (): void => {
  isOpen.value = false;
};

const handleMenuClick = (): void => {
  closeMenu();
};

const handleClickOutside = (event: MouseEvent): void => {
  if (!menuRef.value) return;

  const target = event.target as Node;
  if (!menuRef.value.contains(target)) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.kebab-menu {
  position: relative;
  display: inline-block;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: currentColor;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: var(--sui-purple-700) !important;
}

.button:active,
.active {
  background-color: var(--sui-purple-700) !important;
}

.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1000;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
