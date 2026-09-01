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
const initThemeConfig = (config: CustomThemeConfig = {}): ThemeConfig => ({
  themeName: config.themeName || 'normal',
  theme: {
    normal: createTheme(normalColorMap),
    'normal-dark': createTheme(normalColorMap, true),
    ...createAllTheme(config.theme || {}),
  },
})

const themeConfig = ref<ThemeConfig>(initThemeConfig())
const themeName = ref<string>('normal')

export const useTheme = () => {
  const initTheme = (config: CustomThemeConfig = {}) => {
    themeConfig.value = initThemeConfig(config)
    themeName.value = themeConfig.value.themeName
    console.log(themeConfig.value)
  }

  const getUsedTheme = (themeName: string) => themeConfig.value.theme[themeName]

  const currentTheme = computed(() => getUsedTheme(themeName.value))

  const colorVal = (code: string) => {
    if (isColorCode(code)) return code
    return themeConfig.value.theme[themeName.value][code]
  }

  const colorVar = (code: string) => {
    if (typeof code === 'undefined') return
    return isColorCode(code) ? code : `var(--v-${code})`
  }

  return {
    themeName,
    currentTheme,
    themeConfig,
    colorVal,
    colorVar,
    initTheme,
    getUsedTheme,
  }
}
