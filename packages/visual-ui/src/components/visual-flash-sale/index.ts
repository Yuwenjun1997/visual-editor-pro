import VisualFlashSale from './visual-flash-sale.vue'

export default VisualFlashSale

declare module 'vue' {
  export interface GlobalComponents {
    VisualFlashSale: typeof VisualFlashSale
  }
}