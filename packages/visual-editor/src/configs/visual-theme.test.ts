import { describe, expect, it } from 'vitest'
import { visualTemplates } from '../layout/components/visual-templates/templates'
import visualComponents from '../packages'
import {
  DEFAULT_VISUAL_THEME,
  VISUAL_THEME_PRESETS,
  resolveVisualThemeName,
} from './visual-theme'

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
