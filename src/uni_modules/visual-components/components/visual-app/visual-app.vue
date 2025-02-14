<template>
  <view class="visual-app" :class="_bindClassList" :style="_bindStyles">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useTheme } from '../../hooks/useTheme'
import { useSafeArea } from '../../hooks/useSafeArea'
import type { VisualAppProps } from './interface'

defineOptions({
  name: 'v-app',
})

const _props = withDefaults(defineProps<VisualAppProps>(), {
  safeAreaBottom: true,
  bgColor: 'white',
})

const { themeConfig, themeName, colorVar } = useTheme()

const _currentTheme = computed(() => themeConfig.value.theme[themeName.value])

const { bottom } = useSafeArea()

const _safeAreaBottom = computed(() =>
  _props.safeAreaBottom ? bottom.value : 0
)

const _bindStyles = computed(() => ({
  ...Object.entries(_currentTheme.value).reduce((prev, [key, value]) => {
    prev[`--v-${key}`] = value
    return prev
  }, {} as CSSProperties),
  '--v-bg-color': colorVar(_props.bgColor),
  '--v-safe-area-bottom': `${_safeAreaBottom.value}px`,
}))

const _bindClassList = computed(() => ({
  [themeName.value]: true,
}))
</script>

<style lang="scss">
.visual-app {
  height: 100%;
  flex: 1;
  overflow: hidden;
  background-color: var(--v-bg-color);
  color: var(--v-text-1);
  font-size: var(--v-text-md);

  &::after {
    content: '';
    display: block;
    height: var(--v-safe-area-bottom);
  }
}
</style>
