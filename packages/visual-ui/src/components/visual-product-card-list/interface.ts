import type { VisualProductItemData } from '../visual-product-item/interface'

export { default as VisualProductCardList } from './visual-product-card-list.vue'
export type VisualProductCardListItem = VisualProductItemData
export interface VisualProductCardListProps {
  layout?: 'col-1' | 'col-2' | 'scroll-x'
  cardWidth?: '200px' | '240px' | '280px' | '320px' | '360px'
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  showTag?: boolean
  showBuy?: boolean
  buttonText?: string
  round?: string
  currency?: string
}
