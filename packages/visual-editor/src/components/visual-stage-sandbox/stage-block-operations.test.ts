import { describe, expect, it } from 'vitest'
import type { VisualBlockData, VisualBlockSlotData } from '../../types/visual-editor'
import { applyBlockOperation } from './stage-block-operations'

const slot = (blocks: VisualBlockData[] = [], size?: number): VisualBlockSlotData => ({ name: 'content', blocks, size })

const block = (vid: string, slots: VisualBlockData['slots'] = {}): VisualBlockData => ({
  _vid: vid,
  key: 'VisualText',
  moduleName: 'basicWidgets',
  componentName: 'VisualText',
  label: vid,
  props: {},
  styles: {},
  slots,
})

describe('applyBlockOperation', () => {
  it('inserts a new material block at the requested root index', () => {
    const result = applyBlockOperation([block('a'), block('c')], {
      kind: 'insert',
      operationId: 'insert-b',
      block: block('b'),
      target: { dropId: 'root:root', index: 1 },
    })

    expect(result.ok).toBe(true)
    expect(result.blocks.map((item) => item._vid)).toEqual(['a', 'b', 'c'])
  })

  it('moves a block within the same list using Sortable final indices', () => {
    const result = applyBlockOperation([block('a'), block('b'), block('c')], {
      kind: 'move',
      operationId: 'move-a',
      blockVid: 'a',
      target: { dropId: 'root:root', index: 2 },
    })

    expect(result.ok).toBe(true)
    expect(result.blocks.map((item) => item._vid)).toEqual(['b', 'c', 'a'])
  })

  it('moves a block into a nested slot', () => {
    const container = block('container', { content: slot() })
    const result = applyBlockOperation([block('a'), container], {
      kind: 'move',
      operationId: 'nest-a',
      blockVid: 'a',
      target: { dropId: 'container:content', parentVid: 'container', slotKey: 'content', index: 0 },
    })

    expect(result.ok).toBe(true)
    expect(result.blocks).toHaveLength(1)
    expect(result.blocks[0].slots?.content.blocks.map((item) => item._vid)).toEqual(['a'])
  })

  it('rejects inserting past a slot capacity', () => {
    const container = block('container', { content: slot([block('a')], 1) })
    const result = applyBlockOperation([container], {
      kind: 'insert',
      operationId: 'overflow',
      block: block('b'),
      target: { dropId: 'container:content', parentVid: 'container', slotKey: 'content', index: 1 },
    })

    expect(result).toMatchObject({ ok: false, reason: '当前容器已达到容量上限' })
  })

  it('rejects moving a parent into its own descendant', () => {
    const parent = block('parent', { content: slot([block('child', { content: slot() })]) })
    const result = applyBlockOperation([parent], {
      kind: 'move',
      operationId: 'cycle',
      blockVid: 'parent',
      target: { dropId: 'child:content', parentVid: 'child', slotKey: 'content', index: 0 },
    })

    expect(result).toMatchObject({ ok: false, reason: '不能将组件移动到自身内部' })
  })
})
