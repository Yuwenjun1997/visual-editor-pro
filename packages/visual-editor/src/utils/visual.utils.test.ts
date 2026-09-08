import { describe, expect, it } from 'vitest'
import { formatVisualBlockData } from './visual.utils'

describe('formatVisualBlockData', () => {
  it('creates missing VisualTabs content slots from list data', () => {
    const block = formatVisualBlockData({
      key: 'VisualTabs',
      label: '页签切换',
      moduleName: 'layoutWidgets',
      componentName: 'VisualTabs',
      props: {},
      styles: {},
      listData: [{ label: '推荐' }, { label: '热销' }],
    })

    expect(Object.keys(block.slots || {})).toEqual(['tab-0', 'tab-1'])
    expect(block.slots?.['tab-0']).toEqual({ name: '推荐', blocks: [] })
    expect(block.slots?.['tab-1']).toEqual({ name: '热销', blocks: [] })
  })

  it('preserves existing VisualTabs content when adding missing slots', () => {
    const block = formatVisualBlockData({
      key: 'VisualTabs',
      label: '页签切换',
      moduleName: 'layoutWidgets',
      componentName: 'VisualTabs',
      props: {},
      styles: {},
      listData: [{ label: '推荐' }, { label: '热销' }],
      slots: {
        'tab-0': {
          name: '推荐',
          blocks: [
            {
              _vid: 'child-vid',
              key: 'VisualText',
              label: '文本',
              moduleName: 'basicWidgets',
              componentName: 'VisualText',
              props: {},
              styles: {},
            },
          ],
        },
      },
    })

    expect(block.slots?.['tab-0']?.blocks).toHaveLength(1)
    expect(block.slots?.['tab-1']?.blocks).toEqual([])
  })
})
