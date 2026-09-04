export { default as VisualPoster } from './visual-poster.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualPosterProps {
  bgImage?: string
  title?: string
  subtitle?: string
  footerText?: string
  qrContent?: string
  qrSize?: number
  qrFgColor?: string
  qrBgColor?: string
  buttonText?: string
  shareLink?: VisualUrlValue
}
