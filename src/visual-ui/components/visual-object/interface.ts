import type { VisualSourceOptions } from '../../types'
import type VisualObject from './visual-object.vue'

export type VisualObjectInstance = InstanceType<typeof VisualObject>

export interface VisualObjectProps {
  options?: VisualSourceOptions
}
