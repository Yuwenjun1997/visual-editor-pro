<template>
  <div class="visual-logo">
    <div class="flex items-center justify-center w-12 h-12">
      <img src="/vite.svg" class="w-10 h-10" />
    </div>
    <span class="text-xl">可视化设计</span>
  </div>
</template>

<style lang="scss" scoped>
.visual-logo {
  display: flex;
  align-items: center;
  width: var(--window-left);

  text {
    color: var(--el-text-color-regular);
  }
}
</style>
