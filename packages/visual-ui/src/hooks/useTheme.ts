import { computed, ref } from 'vue'
import type { ThemeConfig, ThemeColors, CustomThemeConfig } from '../types/theme'
import { generateTheme, getThemeCssVariableValue, semanticThemeVariableAliases } from '../utils/theme-utils'
import { isColorCode } from '../utils/validate'

const constantColorMap = {
  white: '#ffffff',
  black: '#101010',
  gray: '#E5E7EB',
  // text: '#1F2937',
}

const normalColorMap = {
  primary: '#2563EB',
  text: '#1F2937',
  warning: '#D97706',
  success: '#0F9D6E',
  error: '#E5484D',
  info: '#0284C7',
}

const createTheme = (v: ThemeColors, d = false) => {
  return generateTheme(Object.assign({}, v, constantColorMap), d)
}

const createAllTheme = (themes: Record<string, ThemeColors>) => {
  return Object.entries(themes).reduce(
    (prev, [k, v]) => ({ ...prev, [k]: createTheme(v), [`${k}-dark`]: createTheme(v, true) }),
    {} as Record<string, Record<string, string>>,
  )
}

const getRawColor = (value?: string) => (value && isColorCode(value) ? value : undefined)

// 初始化主题配置
export const initThemeConfig = (config: CustomThemeConfig = {}): ThemeConfig => ({
  themeName: config.themeName || 'normal',
  theme: {
    normal: createTheme(normalColorMap),
    'normal-dark': createTheme(normalColorMap, true),
    ...createAllTheme({
      ...config.theme,
      ...(config.primary || getRawColor(config.textColor)
        ? {
            [config.themeName || 'normal']: {
              ...normalColorMap,
              ...(config.primary ? { primary: config.primary } : {}),
              ...(getRawColor(config.textColor) ? { text: getRawColor(config.textColor) } : {}),
            },
          }
        : {}),
    }),
  },
})

const themeConfig = ref<ThemeConfig>(initThemeConfig())

const themeName = ref<string>('normal')
const baseThemeName = ref<string>('normal')
const themeColor = ref<string>()

const withPrimaryColor = (theme: Record<string, string>, color: string, dark = false) => {
  const primaryTheme = generateTheme(
    { primary: color, warning: color, success: color, error: color, info: color },
    dark,
  )
  return {
    ...theme,
    ...Object.fromEntries(Object.entries(primaryTheme).filter(([key]) => key.startsWith('primary-'))),
  }
}

export const useTheme = () => {
  const initTheme = (config: CustomThemeConfig = {}) => {
    themeConfig.value = initThemeConfig(config)
    themeName.value = themeConfig.value.themeName
    baseThemeName.value = themeConfig.value.themeName
    themeColor.value = undefined
  }

  const getUsedTheme = (themeName: string) => themeConfig.value.theme[themeName]

  const currentTheme = computed(() => {
    const theme = getUsedTheme(themeName.value)
    return themeColor.value && theme ? withPrimaryColor(theme, themeColor.value) : theme
  })

  const darkTheme = computed(() => {
    const theme = themeConfig.value.theme[`${themeName.value}-dark`] || currentTheme.value
    return themeColor.value && theme ? withPrimaryColor(theme, themeColor.value, true) : theme
  })

  const colorVal = (code: string) => {
    if (isColorCode(code)) return code
    return themeConfig.value.theme[themeName.value]?.[code] || code
  }

  const colorVar = (code?: string) => {
    if (typeof code === 'undefined' || code === '') return
    return isColorCode(code) ||
      code === 'transparent' ||
      code === 'inherit' ||
      code.includes('(') ||
      code.includes('gradient')
      ? code
      : semanticThemeVariableAliases[code]
        ? getThemeCssVariableValue(code, code)
        : `var(--v-${code})`
  }

  const setThemeColor = (value?: string) => {
    themeColor.value = value ? colorVal(value) : undefined
  }

  return {
    themeName,
    baseThemeName,
    currentTheme,
    darkTheme,
    themeColor,
    themeConfig,
    colorVal,
    colorVar,
    initTheme,
    setThemeColor,
    getUsedTheme,
  }
}

export const resolveThemeName = (name: string | null | undefined, available: Record<string, unknown>) =>
  name && available[name] ? name : 'normal'

export const resolveColorValue = (value: string | undefined, theme: Record<string, string>) => {
  if (!value) return undefined
  return isColorCode(value) || value.includes('(') || value.includes('gradient') ? value : theme[value] || value
}
