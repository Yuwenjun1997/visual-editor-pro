import VisualRating from './visual-rating.vue'

export default VisualRating

declare module 'vue' {
  export interface GlobalComponents {
    VisualRating: typeof VisualRating
  }
}