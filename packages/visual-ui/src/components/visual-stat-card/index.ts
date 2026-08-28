import VisualStatCard from './visual-stat-card.vue'

export default VisualStatCard

declare module 'vue' {
  export interface GlobalComponents {
    VisualStatCard: typeof VisualStatCard
  }
}