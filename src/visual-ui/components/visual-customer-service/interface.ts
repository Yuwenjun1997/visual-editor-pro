export { default as VisualCustomerService } from './visual-customer-service.vue'
export interface VisualCustomerServiceProps {
  type?: 'wechat' | 'phone' | 'link'
  text?: string
  phone?: string
  link?: string
  iconVisible?: boolean
  bgColor?: string
  textColor?: string
  radius?: string
}
