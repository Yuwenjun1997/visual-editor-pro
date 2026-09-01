import type { VisualSourceOptions } from '../../types'
import { formatJsonToObjectArray, type JsonObjectArray } from '../../utils'

export const transformCustomSlotObjectArray = (sourceData: VisualSourceOptions): JsonObjectArray =>
  formatJsonToObjectArray(sourceData.customJsonData)
