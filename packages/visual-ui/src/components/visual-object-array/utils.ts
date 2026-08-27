import type { VisualSourceOptions } from '../../types'
import { formatJsonToObjectArray, type JsonObjectArray } from '../../utils'

export const transformCustomSlotObject = (
  sourceData: VisualSourceOptions
): JsonObjectArray => formatJsonToObjectArray(sourceData.customJsonData)
