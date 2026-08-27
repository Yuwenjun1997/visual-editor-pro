import VisualEventContainer from './visual-event-container.vue'

export default VisualEventContainer

declare module 'vue' {
  export interface GlobalComponents {
    VisualEventContainer: typeof VisualEventContainer
  }
}
