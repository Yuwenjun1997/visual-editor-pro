<template>
  <view class="visual-fullscreen">
    <el-tooltip :content="fullscreenLabel">
      <Icon class="btn" :icon="fullscreenIcon" @click="toggle()" />
    </el-tooltip>
  </view>
</template>

<script setup lang="ts" name="VadFullscreen">
import { Icon } from '@iconify/vue'
import { useFullscreen } from '@vueuse/core'

defineOptions({
  name: 'VadFullscreen',
})

// 切换全屏
const { isFullscreen, toggle } = useFullscreen()
const fullscreenIcon = computed(
  () => `material-symbols:fullscreen${isFullscreen.value ? '-exit' : ''}`
)
const fullscreenLabel = computed(() =>
  isFullscreen.value ? '退出全屏' : '全屏'
)
</script>

<style lang="scss">
.visual-fullscreen {
  .btn {
    font-size: 20px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
