import VisualProductCard from './visual-product-card.vue'

export default VisualProductCard

declare module 'vue' {
  export interface GlobalComponents {
    VisualProductCard: typeof VisualProductCard
  }
}
