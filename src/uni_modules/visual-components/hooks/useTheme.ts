import { computed, ref } from 'vue'
import type {
  ThemeConfig,
  ThemeColors,
  CustomThemeConfig,
} from '../types/theme'
import { generateTheme } from '../utils/theme-utils'
import { isColorCode } from '../utils/validate'

const constantColorMap = {
  white: '#ffffff',
  black: '#101010',
  gray: '#bdc3c7',
  text: '#303133',
}

const normalColorMap = {
  primary: '#3498db',
  warning: '#f39c12',
  success: '#09be4f',
  error: '#ff2b2b',
  info: '#34495e',
}

const createTheme = (v: ThemeColors, d = false) => {
  return generateTheme(Object.assign({}, v, constantColorMap), d)
}

const createAllTheme = (themes: Record<string, ThemeColors>) => {
  return {
    ...Object.entries(themes).reduce(
      (prev, [k, v]) => ({ ...prev, [k]: createTheme(v) }),
      {}
    ),
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
