import VisualCountDown from './visual-count-down.vue'

export default VisualCountDown

declare module 'vue' {
  export interface GlobalComponents {
    VisualCountDown: typeof VisualCountDown
  }
}
