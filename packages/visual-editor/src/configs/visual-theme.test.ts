import { describe, expect, it } from 'vitest'
import { visualTemplates } from '../layout/components/visual-templates/templates'
import visualComponents from '../packages'
import { DEFAULT_VISUAL_THEME, VISUAL_THEME_PRESETS, resolvePageThemeName, resolveVisualThemeName } from './visual-theme'
import { getThemeCssVariableValue, initThemeConfig, resolveColorValue, resolveThemeName } from '@visual/ui'

const collectBlocks = (blocks: Array<Record<string, any>>): Array<Record<string, any>> =>
  blocks.flatMap((block) => [
    block,
    ...Object.values(block.slots || {}).flatMap((slot: any) => collectBlocks(slot.blocks || [])),
  ])

describe('visual themes', () => {
  it('exposes five presets and resolves legacy names', () => {
    expect(Object.keys(VISUAL_THEME_PRESETS)).toHaveLength(5)
    expect(resolveVisualThemeName()).toBe(DEFAULT_VISUAL_THEME)
    expect(resolveVisualThemeName('theme-blue')).toBe('theme-blue')
    expect(resolveVisualThemeName('theme-yellow')).toBe('theme-orange')
    expect(resolveVisualThemeName('theme-cyan')).toBe('theme-green')
    expect(resolveVisualThemeName('unknown-theme')).toBe(DEFAULT_VISUAL_THEME)
    expect(resolvePageThemeName()).toBeNull()
    expect(resolvePageThemeName('inherit')).toBeNull()
  })

  it('creates semantic variables and supports an application primary override', () => {
    const config = initThemeConfig({ themeName: 'theme-blue', primary: '#123456' })
    const theme = config.theme['theme-blue']
    expect(theme?.['primary-color']).toBe('#123456')
    expect(theme?.['text-color']).toBeTruthy()
    expect(resolveThemeName('theme-blue', config.theme)).toBe('theme-blue')
    expect(resolveColorValue('primary-color', theme || {})).toBe('#123456')
    expect(resolveColorValue('#fff', theme || {})).toBe('#fff')
  })

  it('maps semantic css variables to the existing theme tokens', () => {
    expect(getThemeCssVariableValue('primary-color', '#123456')).toBe('var(--v-primary-1)')
    expect(getThemeCssVariableValue('background-color', '#f8fafc')).toBe('var(--v-gray-1)')
    expect(getThemeCssVariableValue('bg-color', '#f8fafc')).toBe('var(--v-background-color)')
    expect(getThemeCssVariableValue('custom-color', '#123456')).toBe('#123456')
  })
})

describe('built-in templates', () => {
  it('has valid themes and registered nested blocks', () => {
    const registeredKeys = new Set(Object.values(visualComponents).map((component: any) => component.key))

    expect(visualTemplates).toHaveLength(6)
    visualTemplates.forEach((template) => {
      expect(template.theme?.themeName).toBeTruthy()
      expect(resolveVisualThemeName(template.theme?.themeName)).toBe(template.theme?.themeName)
      collectBlocks(template.blocks).forEach((block) => {
        expect(registeredKeys.has(block.key)).toBe(true)
        expect(block.componentName).toBeTruthy()
      })
    })
  })
})
