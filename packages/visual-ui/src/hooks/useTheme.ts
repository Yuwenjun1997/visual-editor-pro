import { computed, ref } from 'vue'
import type { ThemeConfig, ThemeColors, CustomThemeConfig } from '../types/theme'
import { generateTheme } from '../utils/theme-utils'
import { isColorCode } from '../utils/validate'

const constantColorMap = {
  white: '#ffffff',
  black: '#101010',
  gray: '#E5E7EB',
  text: '#1F2937',
}

const normalColorMap = {
  primary: '#2563EB',
  warning: '#D97706',
  success: '#0F9D6E',
  error: '#E5484D',
  info: '#0284C7',
}

const createTheme = (v: ThemeColors, d = false) => {
  return generateTheme(Object.assign({}, v, constantColorMap), d)
}

const createAllTheme = (themes: Record<string, ThemeColors>) => {
  return {
    ...Object.entries(themes).reduce((prev, [k, v]) => ({ ...prev, [k]: createTheme(v) }), {}),
  }
}

// 初始化主题配置
export const initThemeConfig = (config: CustomThemeConfig = {}): ThemeConfig => ({
  themeName: config.themeName || 'normal',
  theme: {
    normal: createTheme(normalColorMap),
    'normal-dark': createTheme(normalColorMap, true),
    ...createAllTheme({ ...config.theme, ...(config.primary ? { [config.themeName || 'normal']: { ...normalColorMap, primary: config.primary } } : {}) }),
  },
})

const themeConfig = ref<ThemeConfig>(initThemeConfig())

const themeName = ref<string>('normal')
const baseThemeName = ref<string>('normal')

export const useTheme = () => {
  const initTheme = (config: CustomThemeConfig = {}) => {
    themeConfig.value = initThemeConfig(config)
    themeName.value = themeConfig.value.themeName
    baseThemeName.value = themeConfig.value.themeName
  }

  const getUsedTheme = (themeName: string) => themeConfig.value.theme[themeName]

  const currentTheme = computed(() => getUsedTheme(themeName.value))

  const colorVal = (code: string) => {
    if (isColorCode(code)) return code
    return themeConfig.value.theme[themeName.value]?.[code] || code
  }

  const colorVar = (code?: string) => {
    if (typeof code === 'undefined') return
    return isColorCode(code) || code === 'transparent' || code.includes('(') || code.includes('gradient')
      ? code
      : `var(--v-${code})`
  }

  return {
    themeName,
    baseThemeName,
    currentTheme,
    themeConfig,
    colorVal,
    colorVar,
    initTheme,
    getUsedTheme,
  }
}

export const resolveThemeName = (name: string | null | undefined, available: Record<string, unknown>) =>
  name && available[name] ? name : 'normal'

export const resolveColorValue = (value: string | undefined, theme: Record<string, string>) => {
  if (!value) return undefined
  return isColorCode(value) || value.includes('(') || value.includes('gradient') ? value : theme[value] || value
}
