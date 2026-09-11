import { describe, expect, it } from 'vitest'
import type { VisualBlockData } from '../../types/visual-editor'
import { mergeStageBlocks } from './stage-state-sync'

const createBlock = (vid: string, props: Record<string, any> = {}, slots?: VisualBlockData['slots']): VisualBlockData => ({
  _vid: vid,
  key: 'VisualText',
  label: vid,
  moduleName: 'basicWidgets',
  componentName: 'VisualText',
  props,
  styles: {},
  slots,
})

describe('stage state sync', () => {
  it('updates changed blocks without replacing existing block instances', () => {
    const dataBlock = createBlock('data', { options: { dataSource: 'managed', sourceId: 'products' } })
    const current = [dataBlock, createBlock('text', { content: 'old' })]

    mergeStageBlocks(current, [
      createBlock('data', { options: { dataSource: 'managed', sourceId: 'products' } }),
      createBlock('text', { content: 'new' }),
    ])

    expect(current[0]).toBe(dataBlock)
    expect(current[1].props.content).toBe('new')
  })

  it('preserves nested block instances when a parent schema changes', () => {
    const child = createBlock('child', { content: 'old' })
    const parent = createBlock('parent', {}, { content: { name: '内容', blocks: [child] } })
    const current = [parent]

    mergeStageBlocks(current, [
      createBlock('parent', { title: 'updated' }, { content: { name: '内容', blocks: [createBlock('child', { content: 'new' })] } }),
    ])

    expect(current[0]).toBe(parent)
    expect(current[0].slots?.content).toBe(parent.slots?.content)
    expect(current[0].slots?.content.blocks[0]).toBe(child)
    expect(child.props.content).toBe('new')
  })
})
