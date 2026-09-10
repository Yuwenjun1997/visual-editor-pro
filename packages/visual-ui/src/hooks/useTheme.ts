import { computed, ref } from 'vue'
import type { CustomThemeConfig, ThemeConfig } from '../types/theme'
import { createThemeConfig, resolveThemeColorValue, toThemeCssVariable } from '../utils/theme-utils'

export const initThemeConfig = createThemeConfig

const themeConfig = ref<ThemeConfig>(initThemeConfig())

/** 全局单主题状态：应用配置变更时替换整套 light/dark token。 */
export const useTheme = () => {
  const initTheme = (config: CustomThemeConfig = {}) => {
    themeConfig.value = initThemeConfig(config)
  }

  const currentTheme = computed(() => themeConfig.value.light)
  const darkTheme = computed(() => themeConfig.value.dark)
  const colorVal = (code: string) => resolveThemeColorValue(code, currentTheme.value) || code

  return {
    themeConfig,
    currentTheme,
    darkTheme,
    colorVal,
    colorVar: toThemeCssVariable,
    initTheme,
  }
}

export const resolveColorValue = resolveThemeColorValue
