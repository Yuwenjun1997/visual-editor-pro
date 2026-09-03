import { describe, expect, it } from 'vitest'
import { isValidPageSlug, normalizePageSlug } from './visual.validation'

describe('page slug validation', () => {
  it('normalizes user input before validation', () => {
    expect(normalizePageSlug('  My-Page  ')).toBe('my-page')
    expect(isValidPageSlug(normalizePageSlug('  My-Page  '))).toBe(true)
  })

  it('rejects unsafe or ambiguous slugs', () => {
    expect(isValidPageSlug('')).toBe(false)
    expect(isValidPageSlug('my_page')).toBe(false)
    expect(isValidPageSlug('my page')).toBe(false)
    expect(isValidPageSlug('a'.repeat(81))).toBe(false)
  })
})
