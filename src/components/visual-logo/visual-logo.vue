<template>
  <div class="visual-logo">
    <view class="flex items-center justify-center w-12 h-12">
      <image src="/static/vite.svg" class="w-10 h-10" />
    </view>
    <text class="text-xl">可视化设计</text>
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
