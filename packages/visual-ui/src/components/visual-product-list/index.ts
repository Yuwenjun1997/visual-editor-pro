import VisualProductList from './visual-product-list.vue'

export default VisualProductList

declare module 'vue' {
  export interface GlobalComponents {
    VisualProductList: typeof VisualProductList
  }
}