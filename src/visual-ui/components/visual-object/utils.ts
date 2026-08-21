import type { VisualSourceOptions } from '../../types'
import { formatJsonToObject, type JsonObject } from '../../utils'

export const transformCustomSlotObject = (
  options: VisualSourceOptions
): JsonObject => formatJsonToObject(options.customJsonData)
