<template>
  <div class="visual-toggle-dark">
    <el-tooltip :content="_darkThemeLabel">
      <Icon class="btn" :icon="_darkThemeIcon" @click="handleToggleDark" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts" name="VadToggleDark">
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'

defineOptions({
  name: 'VadToggleDark',
})

// 切换暗夜模式
const isDark = useDark()
const toggleDark = useToggle(isDark)
const _darkThemeIcon = computed(() =>
  isDark.value
    ? 'line-md:sun-rising-twotone-loop'
    : 'line-md:sunny-outline-to-moon-loop-transition'
)
const _darkThemeLabel = computed(() => (isDark.value ? '明亮模式' : '暗夜模式'))
const handleToggleDark = () => {
  toggleDark()
}
</script>

<style lang="scss">
.visual-toggle-dark {
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
