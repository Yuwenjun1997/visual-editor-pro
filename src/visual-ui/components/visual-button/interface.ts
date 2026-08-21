export { default as VisualButton } from './visual-button.vue'
export interface VisualButtonProps {
  text?: string
  type?: 'primary' | 'danger' | 'warning' | 'outline'
  size?: 'large' | 'default' | 'small'
  bgColor?: string
  textColor?: string
  radius?: string
  link?: string
}
