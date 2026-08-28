import type { VisualProductItemData } from '../visual-product-item/interface'

export { default as VisualProductList } from './visual-product-list.vue'
export type VisualProductListItem = VisualProductItemData
export interface VisualProductListProps {
  columns?: number
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  showTag?: boolean
  showBuy?: boolean
  buttonText?: string
  round?: string
  currency?: string
}