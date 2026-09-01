export { default as VisualText } from './visual-text.vue'
export interface VisualTextProps {
  text?: string
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  color?: string
  isBold?: boolean
  isItalic?: boolean
  decoration?: 'underline' | 'line-through'
}
