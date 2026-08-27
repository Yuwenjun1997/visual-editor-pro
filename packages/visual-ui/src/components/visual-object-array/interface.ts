import type { VisualSourceOptions } from '../../types'
import type VisualObjectArray from './visual-object-array.vue'

export type VisualObjectArrayInstance = InstanceType<typeof VisualObjectArray>

export interface VisualObjectArrayProps {
  options?: VisualSourceOptions
}
