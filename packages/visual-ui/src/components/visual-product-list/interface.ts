import type { VisualProductItemData } from '../visual-product-item/interface'

export { default as VisualProductList } from './visual-product-list.vue'
export type VisualProductListItem = VisualProductItemData
export interface VisualProductListProps {
  coverInRight?: boolean
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  round?: string
  showTag?: boolean
  showBuy?: boolean
  buttonText?: string
  currency?: string
}