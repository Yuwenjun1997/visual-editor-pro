import VisualGrid from './visual-grid.vue'

export default VisualGrid

declare module 'vue' {
  export interface GlobalComponents {
    VisualGrid: typeof VisualGrid
  }
}
