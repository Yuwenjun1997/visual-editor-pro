export interface ThemeColors {
  primary: string
  warning: string
  success: string
  error: string
  [key: string]: string
}

/** 已展开、可直接写入 CSS 变量的主题 token。 */
export type ThemeTokens = Record<string, string>

export interface ThemeSelection {
  primary?: string
  textColor?: string
}

export interface ThemeConfig {
  light: ThemeTokens
  dark: ThemeTokens
}

export interface CustomThemeConfig {
  primary?: string
  textColor?: string
}
