<template>
  <div class="ui-row">
    <slot />
  </div>
</template>

<style scoped>
.ui-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  justify-content: center;
  align-items: center;
}
</style>
