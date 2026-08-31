<template>
  <div class="wa-flex wa-items-center wa-gap-4">
    <el-tooltip :content="fullscreenLabel">
      <Icon
        class="header-btn"
        :icon="fullscreenIcon"
        @click="toggleFullscreen()"
      />
    </el-tooltip>
    <el-tooltip :content="darkLabel">
      <Icon class="header-btn" :icon="darkIcon" @click="toggleDark()" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDark, useFullscreen, useToggle } from '@vueuse/core'

defineOptions({ name: 'HeaderTools' })

// 全屏切换(复刻原编辑器 visual-fullscreen)
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const fullscreenIcon = computed(
  () => `material-symbols:fullscreen${isFullscreen.value ? '-exit' : ''}`,
)
const fullscreenLabel = computed(() =>
  isFullscreen.value ? '退出全屏' : '全屏',
)

// 暗夜模式(复刻原编辑器 visual-toggle-dark;作用于 html.dark,EP 暗色变量由 web 插件引入)
const isDark = useDark()
const toggleDark = useToggle(isDark)
const darkIcon = computed(() =>
  isDark.value
    ? 'line-md:sun-rising-twotone-loop'
    : 'line-md:sunny-outline-to-moon-loop-transition',
)
const darkLabel = computed(() => (isDark.value ? '明亮模式' : '暗夜模式'))
</script>

<style scoped>
.header-btn {
  font-size: 20px;
  cursor: pointer;
}
.header-btn:hover {
  color: var(--el-color-primary);
}
</style>
