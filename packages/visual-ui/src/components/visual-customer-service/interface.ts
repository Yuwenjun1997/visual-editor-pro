export { default as VisualCustomerService } from './visual-customer-service.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualCustomerServiceProps {
  type?: 'wechat' | 'phone' | 'link'
  text?: string
  phone?: string
  link?: VisualUrlValue
  iconVisible?: boolean
  bgColor?: string
  textColor?: string
  radius?: string
}
