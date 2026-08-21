import type { VisualSourceOptions } from '../../types'
import type VisualData from './visual-data.vue'

export type VisualDataInstance = InstanceType<typeof VisualData>

export interface VisualObjectArrayProps {
  options?: VisualSourceOptions
}
