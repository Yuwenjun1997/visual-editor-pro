import type { CustomThemeConfig, ThemeColors, ThemeConfig, ThemeTokens } from '../types/theme'
import { isColorCode } from './validate'

export const semanticThemeVariableAliases = {
  'primary-color': 'primary-1',
  'background-color': 'gray-1',
  'bg-color': 'background-color',
  'card-background-color': 'surface-color',
  'success-color': 'success-1',
  'warning-color': 'warning-1',
  'error-color': 'error-1',
  'info-color': 'info-1',
} as const

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#2563EB',
  warning: '#D97706',
  success: '#0F9D6E',
  error: '#E5484D',
  info: '#0284C7',
}

export const DEFAULT_LIGHT_TEXT_COLOR = '#1F2937'
export const DEFAULT_DARK_TEXT_COLOR = '#F9FAFB'
export const DEFAULT_LIGHT_CARD_COLOR = '#FFFFFF'
export const DEFAULT_DARK_CARD_COLOR = '#1F2937'
export const DEFAULT_LIGHT_FOREGROUND_COLOR = '#F3F4F6'
export const DEFAULT_DARK_FOREGROUND_COLOR = '#111827'
export const DEFAULT_LIGHT_BORDER_COLOR = '#E5E7EB'
export const DEFAULT_DARK_BORDER_COLOR = '#374151'

const constantThemeColors: Record<string, string> = {
  white: '#ffffff',
  black: '#101010',
  gray: '#E5E7EB',
}

const rootDynamicThemeKeys = new Set(['page-background-color', 'safe-area-bottom'])

export const getThemeCssVariableValue = (key: string, value: string) => {
  const alias = semanticThemeVariableAliases[key as keyof typeof semanticThemeVariableAliases]
  return alias ? `var(--v-${alias})` : String(value)
}

export const isLiteralThemeColor = (value: string) =>
  isColorCode(value) ||
  value === 'transparent' ||
  value === 'inherit' ||
  value.includes('(') ||
  value.includes('gradient')

export const resolveThemeColorValue = (value: string | undefined, theme: ThemeTokens) => {
  if (!value) return undefined
  if (isLiteralThemeColor(value)) return value
  const token = semanticThemeVariableAliases[value as keyof typeof semanticThemeVariableAliases] || value
  return theme[token] || value
}

export const toThemeCssVariable = (value: string | undefined) => {
  if (!value) return undefined
  if (isLiteralThemeColor(value)) return value
  return semanticThemeVariableAliases[value as keyof typeof semanticThemeVariableAliases]
    ? getThemeCssVariableValue(value, value)
    : `var(--v-${value})`
}

export const darken = (color: string, percent: number): string => {
  const number = parseInt(color.slice(1), 16)
  const amount = Math.round(2.55 * percent)
  const red = (number >> 16) - amount
  const green = ((number >> 8) & 0x00ff) - amount
  const blue = (number & 0x0000ff) - amount

  return `#${(
    0x1000000 +
    (red < 255 ? (red < 0 ? 0 : red) : 255) * 0x10000 +
    (green < 255 ? (green < 0 ? 0 : green) : 255) * 0x100 +
    (blue < 255 ? (blue < 0 ? 0 : blue) : 255)
  )
    .toString(16)
    .slice(1)
    .toUpperCase()}`
}

export const lighten = (color: string, percent: number): string => darken(color, -percent)

export const processColor = (color: string, opacity: number): string => {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    throw new Error('Invalid color format. Use #RRGGBB.')
  }

  const hex =
    color.length === 4
      ? color
          .slice(1)
          .split('')
          .map((value) => value + value)
          .join('')
      : color.slice(1)
  const number = parseInt(hex, 16)
  return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${opacity})`
}

export const mixColors = (color1: string, color2: string, percentage: number) => {
  const hexToRgb = (hex: string): [number, number, number] => {
    const number = parseInt(hex.slice(1), 16)
    return [(number >> 16) & 255, (number >> 8) & 255, number & 255]
  }
  const rgbToHex = (red: number, green: number, blue: number) =>
    '#' + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1).toUpperCase()
  const [red1, green1, blue1] = hexToRgb(color1)
  const [red2, green2, blue2] = hexToRgb(color2)
  const ratio = percentage / 100

  return rgbToHex(
    Math.round(red1 * (1 - ratio) + red2 * ratio),
    Math.round(green1 * (1 - ratio) + green2 * ratio),
    Math.round(blue1 * (1 - ratio) + blue2 * ratio),
  )
}

export const generateTheme = (colors: Record<string, string>, isDark = false): ThemeTokens => {
  const result: ThemeTokens = {}
  Object.entries(colors).forEach(([key, value]) => {
    for (let index = 0; index < 6; index++) {
      if (!['white', 'black'].includes(key)) {
        result[`${key}-${index + 1}`] = isDark
          ? mixColors(value, '#000000', index * 16)
          : mixColors(value, '#ffffff', index * 16)
      } else {
        result[key] = value
      }
    }
    for (let index = 0; index < 6; index++) {
      result[`${key}-opacity-${index + 1}`] = processColor(value, 0.1 * (6 - index))
    }
  })

  return result
}

const createTheme = (colors: ThemeColors, isDark = false): ThemeTokens => {
  const { text, ...palette } = colors
  return {
    ...generateTheme({ ...constantThemeColors, ...palette }, isDark),
    'text-color': text || (isDark ? DEFAULT_DARK_TEXT_COLOR : DEFAULT_LIGHT_TEXT_COLOR),
    'surface-color': isDark ? DEFAULT_DARK_CARD_COLOR : DEFAULT_LIGHT_CARD_COLOR,
    'foreground-color': isDark ? DEFAULT_DARK_FOREGROUND_COLOR : DEFAULT_LIGHT_FOREGROUND_COLOR,
    'border-color': isDark ? DEFAULT_DARK_BORDER_COLOR : DEFAULT_LIGHT_BORDER_COLOR,
  }
}

export const createThemeConfig = (config: CustomThemeConfig = {}): ThemeConfig => {
  const colors = {
    ...DEFAULT_THEME_COLORS,
    ...(config.primary ? { primary: config.primary } : {}),
    ...(config.textColor && isColorCode(config.textColor) ? { text: config.textColor } : {}),
  }
  return {
    light: createTheme(colors),
    dark: createTheme(colors, true),
  }
}

export const serializeThemeCssVariables = (tokens: ThemeTokens) => {
  return Object.entries(tokens)
    .filter(([key]) => !rootDynamicThemeKeys.has(key))
    .map(([key, value]) => `--v-${key}:${getThemeCssVariableValue(key, value)};`)
    .join('')
}
