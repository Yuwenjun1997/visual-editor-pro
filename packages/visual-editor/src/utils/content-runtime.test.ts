import { describe, it, expect } from 'vitest'
import { canDisplay } from '../../../visual-ui/src/utils/auth'
import { sanitizeRichText } from '../../../visual-ui/src/utils/sanitize'
import { defaultPageBlocks, upgradeTemplateBlocks } from '../../../visual-ui/src/utils/page-template'
import { normalizeLoginConfig, safeLoginRedirect } from '../../../visual-ui/src/types/app-login'
import type { H5AuthState } from '../../../visual-ui/src/hooks/useH5Runtime'
import type { VisualRuntimeBlock } from '../../../visual-ui/src/types'
describe('authorization display policies', () => {
  const member: H5AuthState = { status: 'authenticated', profile: { id: '1', role: 'viewer' } }
  it('hides contents while identity is unavailable', () => {
    for (const status of ['loading', 'error'] as const) expect(canDisplay({ status, profile: null }, {})).toBe(false)
  })
  it('combines login and role conditions', () => {
    expect(canDisplay(member, { login: 'authenticated', roles: 'admin,editor', mode: 'all' })).toBe(false)
    expect(canDisplay(member, { login: 'authenticated', roles: 'admin,editor', mode: 'any' })).toBe(true)
    expect(canDisplay(member, { roles: 'viewer' })).toBe(true)
    expect(canDisplay({ status: 'anonymous', profile: null }, { roles: 'viewer' })).toBe(false)
    expect(canDisplay({ status: 'anonymous', profile: null }, { login: 'anonymous' })).toBe(true)
  })
})
describe('login compatibility and redirects', () => {
  it('defaults legacy settings and keeps configured fields', () => {
    expect(normalizeLoginConfig(null).layout).toBe('card')
    expect(normalizeLoginConfig({ layout: 'brand', radius: 99 }).radius).toBe(40)
    expect(normalizeLoginConfig({ buttonText: '进入' }).buttonText).toBe('进入')
  })
  it('returns to an app page with its query and fragment', () => {
    expect(safeLoginRedirect('/apps/demo/product/1?from=card#info', 'demo')).toBe('/apps/demo/product/1?from=card#info')
  })
  it.each([
    'https://evil.test',
    '//evil.test',
    '/apps/other/profile',
    '/apps/demo/login',
    '/apps/demo/../../other',
    '/apps/demo/%2f%2fevil.test',
  ])('rejects unsafe return target %s', (target) => {
    expect(safeLoginRedirect(target, 'demo')).toBe('/apps/demo/profile')
  })
})
describe('legacy template conversion', () => {
  const blocks: VisualRuntimeBlock[] = [
    {
      _vid: 'old',
      key: 'VisualText',
      componentName: 'VisualText',
      label: '文本',
      moduleName: 'basicWidgets',
      props: { text: '商品详情', fontSize: 'lg', textAlign: 'center' },
      styles: { padding: '32px 16px' },
    },
  ]
  it('converts the original placeholder into a detail block', () => {
    expect(upgradeTemplateBlocks(blocks, 'product-detail', '商品详情')[0]?.key).toBe('VisualProductDetail')
    expect(defaultPageBlocks('profile')[0]?.key).toBe('VisualUserCard')
  })
  it('preserves empty and custom schemas', () => {
    expect(upgradeTemplateBlocks([], 'profile', '个人中心')).toEqual([])
    const edited = structuredClone(blocks)
    edited[0]!.props!.text = '自定义内容'
    expect(upgradeTemplateBlocks(edited, 'product-detail', '商品详情')).toBe(edited)
    expect(upgradeTemplateBlocks(blocks, 'custom', '商品详情')).toBe(blocks)
  })
})
describe('SSR rich text sanitization', () => {
  it('keeps formatting and images without a DOM', () => {
    expect(sanitizeRichText('<h2>标题</h2><ul><li>内容</li></ul><img src="https://example.com/a.png">')).toContain(
      '<h2>标题</h2>',
    )
  })
  it('removes executable attributes, embedded scripts and unsafe protocols', () => {
    const html = sanitizeRichText(
      '<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">危险</a><iframe src="https://evil.test"></iframe>',
    )
    expect(html).not.toMatch(/script|onerror|iframe|javascript:/)
  })
})
