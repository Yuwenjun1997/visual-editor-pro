export { default as VisualFlashSale } from './visual-flash-sale.vue'
import type { VisualUrlValue } from '../../types/url'
export interface VisualFlashSaleProps {
  title?: string
  endTime?: string
  showDays?: boolean
  price?: number | string
  originPrice?: number | string
  soldNum?: number | string
  totalNum?: number | string
  bgColor?: string
  numColor?: string
  buttonText?: string
  buyLink?: VisualUrlValue
  currency?: string
}
