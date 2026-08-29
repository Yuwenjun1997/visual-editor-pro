import VisualProductCardList from './visual-product-card-list.vue'

export default VisualProductCardList

declare module 'vue' {
  export interface GlobalComponents {
    VisualProductCardList: typeof VisualProductCardList
  }
}