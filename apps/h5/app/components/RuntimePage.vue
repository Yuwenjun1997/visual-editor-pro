<template>
  <main :style="pageStyle" class="runtime-page">
    <VisualPageRenderer :blocks="page.schema.blocks" />
  </main>
</template>

<script setup lang="ts">
import { useTheme } from '@visual/ui'
import { mountThemeToRoot } from '@visual/ui/hooks/useMountThemeToRoot'
import type { RuntimePage } from '../types/runtime'

const props = defineProps<{ page: RuntimePage }>()
const pageStyle = computed(() => props.page.schema.globalStyle || {})
const pageTextColor = computed(() => pageStyle.value.color || 'inherit')
const { themeConfig, themeName, baseThemeName } = useTheme()

mountThemeToRoot({
  color: () => pageTextColor.value,
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.documentElement.style.setProperty('--v-text-color', 'inherit')
})

// 页面 schema 的 themeName 优先于应用默认主题。仅接受已注册的主题，
// 避免历史或手工输入的无效名称导致主题 CSS 变量为空。
watchEffect(() => {
  const name = props.page.schema.themeName
  themeName.value = name && themeConfig.value.theme[name] ? name : baseThemeName.value
})
</script>

<style scoped>
.runtime-page {
  min-height: 100%;
}
</style>
