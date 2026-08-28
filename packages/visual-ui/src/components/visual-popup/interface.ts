export { default as VisualPopup } from './visual-popup.vue'
export interface VisualPopupProps {
  mode?: 'firstVisit' | 'delay' | 'manual'
  delaySeconds?: number
  bgImage?: string
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  showClose?: boolean
  frequency?: 'once' | 'session' | 'every'
}