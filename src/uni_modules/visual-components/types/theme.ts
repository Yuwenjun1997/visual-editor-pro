export interface ThemeColors {
  primary: string
  warning: string
  success: string
  error: string
  [key: string]: string
}

export interface ThemeConfig {
  themeName: string
  theme: {
    [key: string]: Record<string, string>
  }
}

export interface CustomThemeConfig {
  themeName?: string
  theme?: {
    [key: string]: ThemeColors
  }
}
