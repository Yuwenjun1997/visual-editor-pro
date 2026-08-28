import VisualProductItem from './visual-product-item.vue'

export default VisualProductItem

declare module 'vue' {
  export interface GlobalComponents {
    VisualProductItem: typeof VisualProductItem
  }
}