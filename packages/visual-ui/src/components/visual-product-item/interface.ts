export { default as VisualProductItem } from './visual-product-item.vue'
import type { VisualUrlValue } from '../../types/url'

export interface VisualProductItemData {
  id?: string
  cover?: string
  title?: string
  price?: number | string
  originPrice?: number | string
  tag?: string
  buyLink?: VisualUrlValue
}
export interface VisualProductItemProps {
  data?: VisualProductItemData
  layout?: 'vertical' | 'horizontal'
  showTag?: boolean
  showBuy?: boolean
  buttonText?: string
  backgroundColor?: string
  round?: string
  currency?: string
}
