export { default as VisualPopup } from './visual-popup.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualPopupProps {
  mode?: 'firstVisit' | 'delay' | 'manual'
  delaySeconds?: number
  bgImage?: string
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: VisualUrlValue
  showClose?: boolean
  frequency?: 'once' | 'session' | 'every'
}
