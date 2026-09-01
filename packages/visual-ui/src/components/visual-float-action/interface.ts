export { default as VisualFloatAction } from './visual-float-action.vue'
export interface VisualFloatActionProps {
  mode?: 'backTop' | 'customerService' | 'share' | 'link'
  icon?: string
  bgColor?: string
  textColor?: string
  position?: 'right' | 'left'
  bottom?: string
  phone?: string
  link?: string
  showBackTopAfter?: number
}
