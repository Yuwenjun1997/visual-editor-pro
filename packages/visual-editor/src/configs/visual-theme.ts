import type { CustomThemeConfig } from '@visual/ui/types'

export const DEFAULT_VISUAL_THEME = 'theme-blue'

export const VISUAL_THEME_PRESETS = {
  'theme-blue': { label: '靛蓝', color: '#4F46E5', primary: '#4F46E5' },
  'theme-green': { label: '青绿', color: '#0F9D6E', primary: '#0F9D6E' },
  'theme-orange': { label: '琥珀', color: '#D97706', primary: '#D97706' },
  'theme-red': { label: '玫红', color: '#E5484D', primary: '#E5484D' },
  'theme-purple': { label: '紫罗兰', color: '#7C3AED', primary: '#7C3AED' },
} as const

export type VisualThemeName = keyof typeof VISUAL_THEME_PRESETS

const legacyThemeAliases: Record<string, VisualThemeName> = {
  'theme-yellow': 'theme-orange',
  'theme-cyan': 'theme-green',
}

export const resolveVisualThemeName = (themeName?: string | null): VisualThemeName => {
  if (themeName && themeName in VISUAL_THEME_PRESETS) return themeName as VisualThemeName
  return (themeName && legacyThemeAliases[themeName]) || DEFAULT_VISUAL_THEME
}

export const visualThemeConfig: CustomThemeConfig = {
  themeName: DEFAULT_VISUAL_THEME,
  theme: Object.fromEntries(
    Object.entries(VISUAL_THEME_PRESETS).map(([name, preset]) => [
      name,
      {
        primary: preset.primary,
        warning: '#D97706',
        success: '#0F9D6E',
        error: '#E5484D',
        info: '#0284C7',
      },
    ]),
  ),
}
