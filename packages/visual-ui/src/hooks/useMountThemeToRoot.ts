import { watchEffect } from 'vue'
import { useTheme } from './useTheme'
import { serializeThemeCssVariables, toThemeCssVariable } from '../utils/theme-utils'

type ThemeRootValue<T> = T | (() => T)

export interface MountThemeToRootOptions {
  /** 字体颜色 */
  textColor?: ThemeRootValue<string | undefined>
  /** 页面背景色：字面色值或主题 key（同 VisualAppProps.bgColor），传 getter 以保持响应式 */
  bgColor?: ThemeRootValue<string | undefined>
  /** 底部安全区高度；数字会自动转换为 px，字符串保留为合法 CSS 长度。 */
  safeAreaBottom?: ThemeRootValue<string | number | undefined>
}

const getOptionValue = <T>(value: ThemeRootValue<T> | undefined) =>
  typeof value === 'function' ? (value as () => T)() : value

const toCssLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)

const clearDynamicRootVariables = (root: HTMLElement) => {
  root.style.removeProperty('--v-text-color')
  root.style.removeProperty('--v-page-background-color')
  root.style.removeProperty('--v-safe-area-bottom')
}

/**
 * 将当前主题发布到 documentElement。返回的停止函数应在宿主卸载时调用，
 * 以释放 watcher 和页面级动态变量；服务端渲染时保持无副作用。
 */
export const mountThemeToRoot = (options: MountThemeToRootOptions = {}) => {
  const { currentTheme, darkTheme } = useTheme()
  const stop = watchEffect(() => {
    if (typeof document === 'undefined') return
    const theme = currentTheme.value
    if (!theme) return

    const root = document.documentElement
    let style = document.head.querySelector<HTMLStyleElement>('style[data-visual-theme]')
    if (!style) {
      style = document.createElement('style')
      style.dataset.visualTheme = ''
      document.head.appendChild(style)
    }

    const themeContent = `:root{${serializeThemeCssVariables(theme)}}`
    const darkThemeContent = `html.dark{${serializeThemeCssVariables(darkTheme.value || theme)}}`

    style.textContent = themeContent + darkThemeContent

    const textColor = getOptionValue(options.textColor)
    if (textColor !== undefined) root.style.setProperty('--v-text-color', toThemeCssVariable(textColor) || 'inherit')
    else root.style.removeProperty('--v-text-color')

    const bgColor = getOptionValue(options.bgColor)
    if (bgColor !== undefined) {
      root.style.setProperty('--v-page-background-color', toThemeCssVariable(bgColor) || 'transparent')
    } else root.style.removeProperty('--v-page-background-color')

    const safeAreaBottom = getOptionValue(options.safeAreaBottom)
    if (safeAreaBottom !== undefined) root.style.setProperty('--v-safe-area-bottom', toCssLength(safeAreaBottom))
    else root.style.removeProperty('--v-safe-area-bottom')
  })

  return () => {
    stop()
    if (typeof document !== 'undefined') clearDynamicRootVariables(document.documentElement)
  }
}
