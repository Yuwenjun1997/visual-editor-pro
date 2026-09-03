import { VISUAL_THEME_PRESETS } from '../../../../configs/visual-theme'

export const themeMap = Object.fromEntries(
  Object.entries(VISUAL_THEME_PRESETS).map(([name, preset]) => [name, preset.color]),
) as Record<keyof typeof VISUAL_THEME_PRESETS, string>
