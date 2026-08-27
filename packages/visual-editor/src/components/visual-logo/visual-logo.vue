<template>
  <div class="visual-logo">
    <div class="ve-flex ve-items-center ve-justify-center ve-w-12 ve-h-12">
      <img src="/vite.svg" class="ve-w-10 ve-h-10" />
    </div>
    <span class="ve-text-xl">可视化设计</span>
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
