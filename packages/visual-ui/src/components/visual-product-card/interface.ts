export { default as VisualProductCard } from './visual-product-card.vue'
export interface VisualProductCardProps {
  cover?: string
  title?: string
  price?: number | string
  originPrice?: number | string
  tag?: string
  buttonText?: string
  buyLink?: string
  layout?: 'vertical' | 'horizontal'
  showTag?: boolean
  showBuy?: boolean
  round?: string
  currency?: string
}