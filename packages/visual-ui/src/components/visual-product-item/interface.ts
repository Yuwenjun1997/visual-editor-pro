export { default as VisualProductItem } from './visual-product-item.vue'
export interface VisualProductItemData {
  id?: string
  cover?: string
  title?: string
  price?: number | string
  originPrice?: number | string
  tag?: string
  buyLink?: string
}
export interface VisualProductItemProps {
  data?: VisualProductItemData
  layout?: 'vertical' | 'horizontal'
  showTag?: boolean
  showBuy?: boolean
  buttonText?: string
  round?: string
  currency?: string
}
