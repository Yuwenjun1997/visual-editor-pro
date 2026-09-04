export { default as VisualSearch } from './visual-search.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualSearchProps {
  placeholder?: string
  buttonText?: string
  buttonColor?: string
  radius?: string
  confirmLink?: VisualUrlValue
}
