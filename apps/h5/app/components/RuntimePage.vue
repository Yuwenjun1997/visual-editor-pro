<template>
  <main :style="pageStyle" class="runtime-page">
    <VisualPageRenderer :blocks="page.schema.blocks" />
  </main>
</template>

<script setup lang="ts">
import { useTheme } from '@visual/ui'
import { mountThemeToRoot } from '@visual/ui/hooks/useMountThemeToRoot'
import type { RuntimePage } from '../types/runtime'
import { APP_TEXT_COLOR_KEY } from '../app-context'

const props = defineProps<{ page: RuntimePage }>()
const pageStyle = computed(() => props.page.schema.globalStyle || {})
const appTextColor = inject(
  APP_TEXT_COLOR_KEY,
  computed(() => undefined),
)
const pageTextColor = computed(() => pageStyle.value.color || appTextColor.value)
const { themeConfig, themeName, baseThemeName, setThemeColor } = useTheme()

mountThemeToRoot({
  color: () => pageTextColor.value,
})

// 页面主题支持已注册主题名，也支持实际颜色值或颜色 token。
watchEffect(() => {
  const name = props.page.schema.themeName
  if (name && themeConfig.value.theme[name]) {
    themeName.value = name
    setThemeColor()
  } else {
    themeName.value = baseThemeName.value
    setThemeColor(name || undefined)
  }
})
</script>

<style scoped>
.runtime-page {
  min-height: 100%;
}
</style>
