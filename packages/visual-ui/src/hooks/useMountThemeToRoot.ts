import { watchEffect } from 'vue'
import { useTheme } from './useTheme'

export interface MountThemeToRootOptions {
  /** 页面背景色：字面色值或主题 key（同 VisualAppProps.bgColor），传 getter 以保持响应式 */
  bgColor?: string | (() => string)
  /** 底部安全区高度（px），传 getter 以保持响应式 */
  safeAreaBottom?: string | number | (() => string | number)
}

/**
 * 将视觉库的 `--v-*` 主题变量挂载到 documentElement。
 * 无参调用只挂 `--v-*` 主题变量（供 `.visual-app` 之外的编辑面板/teleport 弹层取用）；
 * 传入 `bgColor`/`safeAreaBottom` 时额外挂载 `--v-bg-color` 与 `--v-safe-area-bottom`。
 */
export const mountThemeToRoot = (options: MountThemeToRootOptions = {}) => {
  const { currentTheme, colorVar } = useTheme()
  watchEffect(() => {
    const theme = currentTheme.value
    if (!theme) return
    const root = document.documentElement

    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--v-${key}`, String(value))
    })

    const bgColor =
      typeof options.bgColor === 'function' ? options.bgColor() : options.bgColor
    if (bgColor !== undefined) {
      root.style.setProperty('--v-bg-color', colorVar(bgColor) || 'transparent')
    }

    const safeAreaBottom =
      typeof options.safeAreaBottom === 'function'
        ? options.safeAreaBottom()
        : options.safeAreaBottom
    if (safeAreaBottom !== undefined) {
      root.style.setProperty('--v-safe-area-bottom', `${safeAreaBottom}px`)
    }
  })
}