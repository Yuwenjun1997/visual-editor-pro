import VisualImageTextCard from './visual-image-text-card.vue'

export default VisualImageTextCard

declare module 'vue' {
  export interface GlobalComponents {
    VisualImageTextCard: typeof VisualImageTextCard
  }
}
