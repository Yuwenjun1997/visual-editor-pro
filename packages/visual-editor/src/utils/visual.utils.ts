import { customAlphabet } from 'nanoid'

import type {
  VisualBlockData,
  VisualEditorComponent,
} from '../types/visual-editor'
import { visualConfig } from './visual.registry'
import { cloneDeep } from 'lodash'

export const generateNanoid = customAlphabet('123456ABCDEF', 6)

export const createVisualBlock = (
  visualComponent: VisualEditorComponent
): VisualBlockData => {
  const component = cloneDeep(visualComponent)

  const createProps = (props: Record<string, any> = {}) => {
    return Object.entries(props).reduce((prev, [propName, propSchema]) => {
      prev[propName] = propSchema?.defaultValue
      return prev
    }, {} as Record<string, any>)
  }

  const createListData = (
    propsList: Record<string, any>[]
  ): Record<string, any>[] => propsList.map((item) => createProps(item))

  const listData = component.listData

  return {
    _vid: `vid_${generateNanoid()}`,
    key: component.key,
    label: component.label,
    moduleName: component.moduleName,
    componentName: component.componentName,
    styles: Object.assign({ opacity: 1 }, component.styles || {}),
    props: createProps(component.props),
    slots: component.slots,
    listData: listData?.data && createListData(listData?.data),
    souceDataType: component.souceDataType,
  }
}

export const createVisualEditorComponent = (
  block: VisualBlockData
): VisualEditorComponent => {
  const component = cloneDeep(visualConfig.componentMap[block.key])

  // 处理默认属性值
  Object.entries(block.props).forEach(([propName, value]) => {
    const propSchema = component.props && component.props[propName]
    if (!propSchema) return
    propSchema.defaultValue = value
  })

  // 清空默认数据
  if (component.listData) {
    component.listData.data = []
  }

  // 处理默认数据列表
  block.listData?.forEach((item, index) => {
    if (!component.listData?.data[index]) {
      component.listData?.addData()
    }
    const data = component.listData?.data[index]
    Object.entries(item).forEach(([propName, value]) => {
      const propSchema = data && data[propName]
      if (!propSchema) return
      propSchema.defaultValue = value
    })
  })

  return component
}

/**
 * 提取css的值和单位
 * @param cssValue
 * @param unit
 * @returns
 */
export function extractValueAndUnit(cssValue: string, unit = 'px') {
  // 使用正则表达式匹配数字和单位
  const pattern = /(\d+(?:\.\d+)?)(%|\w+)/
  const match = cssValue.match(pattern)

  // 如果匹配成功，则返回值和单位的数组，否则返回 null
  if (match) {
    return [parseFloat(match[1]), match[2]]
  } else {
    return [null, unit]
  }
}

export const formatVisualBlockData = (
  block: Partial<VisualBlockData>
): VisualBlockData => {
  if (typeof block !== 'object') block = {}
  if (!block.key) throw new Error('block.key is required')
  if (!block.label) throw new Error('block.label is required')
  if (!block.moduleName) throw new Error('block.moduleName is required')
  if (!block.componentName) throw new Error('block.componentName is required')
  block._vid = block._vid || `vid_${generateNanoid()}`
  block.styles = Object.assign({ opacity: 1 }, block.styles || {})
  block.props = block.props || {}

  Object.entries(block.slots || {}).forEach(([, slot]) => {
    slot.blocks = slot.blocks.map((block) => formatVisualBlockData(block))
  })

  return {
    _vid: block._vid,
    key: block.key,
    label: block.label,
    moduleName: block.moduleName,
    componentName: block.componentName,
    styles: block.styles,
    props: block.props,
    slots: block.slots,
    listData: block.listData,
  }
}

export const isSameBlock = (
  oldBlock: VisualBlockData,
  newBlock: VisualBlockData
) => {
  return JSON.stringify(oldBlock) === JSON.stringify(newBlock)
}
