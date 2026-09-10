import { describe, expect, it } from 'vitest'
import { visualTemplates } from '../layout/components/visual-templates/templates'
import visualComponents from '../packages'
import { visualThemeConfig } from './visual-theme'
import { initThemeConfig, resolveColorValue, serializeThemeCssVariables, useTheme } from '@visual/ui'

const collectBlocks = (blocks: Array<Record<string, any>>): Array<Record<string, any>> =>
  blocks.flatMap((block) => [
    block,
    ...Object.values(block.slots || {}).flatMap((slot: any) => collectBlocks(slot.blocks || [])),
  ])

describe('visual themes', () => {
  it('creates exactly one light and dark theme from the configured primary color', () => {
    const config = initThemeConfig({ primary: '#123456' })

    expect(Object.keys(config)).toEqual(['light', 'dark'])
    expect(config.light['primary-1']).toBe('#123456')
    expect(config.dark['primary-2']).not.toBe(config.light['primary-2'])
    expect(resolveColorValue('primary-color', config.light)).toBe('#123456')
  })

  it('provides card fill and text defaults for both modes', () => {
    const config = initThemeConfig()

    expect(config.light['surface-color']).toBe('#FFFFFF')
    expect(config.dark['surface-color']).toBe('#1F2937')
    expect(config.light['border-color']).toBe('#E5E7EB')
    expect(config.dark['border-color']).toBe('#374151')
    expect(config.light['text-color']).toBe('#1F2937')
    expect(config.dark['text-color']).toBe('#F9FAFB')
    expect(Object.keys(config.light).some((key) => /^text-(?:[1-6]|opacity-)/.test(key))).toBe(false)
  })

  it('serializes each mode with its own card fill token', () => {
    const config = initThemeConfig()
    expect(serializeThemeCssVariables(config.light)).not.toContain('--v-fill-color:')
    expect(serializeThemeCssVariables(config.dark)).toContain('--v-surface-color:#1F2937;')
  })

  it('updates both token sets when the application theme changes', () => {
    const { currentTheme, darkTheme, initTheme } = useTheme()
    initTheme({ primary: '#123456' })
    expect(currentTheme.value['primary-1']).toBe('#123456')
    expect(darkTheme.value['primary-1']).toBe('#123456')
    initTheme(visualThemeConfig)
  })
})

describe('built-in templates', () => {
  it('has registered nested blocks without applying template theme names', () => {
    const registeredKeys = new Set(Object.values(visualComponents).map((component: any) => component.key))

    expect(visualTemplates).toHaveLength(6)
    visualTemplates.forEach((template) => {
      collectBlocks(template.blocks).forEach((block) => {
        expect(registeredKeys.has(block.key)).toBe(true)
        expect(block.componentName).toBeTruthy()
      })
    })
  })
})
