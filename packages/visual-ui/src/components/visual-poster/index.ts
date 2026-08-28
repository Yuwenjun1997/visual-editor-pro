import VisualPoster from './visual-poster.vue'

export default VisualPoster

declare module 'vue' {
  export interface GlobalComponents {
    VisualPoster: typeof VisualPoster
  }
}