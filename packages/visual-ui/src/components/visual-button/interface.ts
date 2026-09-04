export { default as VisualButton } from './visual-button.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualButtonProps {
  text?: string
  variant?: 'primary' | 'destructive' | 'warning' | 'outline'
  size?: 'lg' | 'default' | 'sm'
  bgColor?: string
  textColor?: string
  radius?: string
  link?: VisualUrlValue
}
