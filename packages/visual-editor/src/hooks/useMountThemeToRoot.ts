import { watchEffect } from 'vue'
import { useTheme } from '@visual/ui/hooks/useTheme'

/**
 * 将 visual-ui 的 `--v-*` 主题变量挂载到 documentElement。
 * visual-ui 仅在 `.visual-app` 子树注入这些变量，而编辑器面板
 * （icon-picker/theme-picker 等）渲染在 `.visual-app` 之外且
 * el-dialog/el-popover 会 teleport 到 body，因此统一挂到 <html> 根。
 */
export const mountThemeToRoot = () => {
  const { currentTheme } = useTheme()
  watchEffect(() => {
    const theme = currentTheme.value
    if (!theme) return
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--v-${key}`, String(value))
    })
  })
}