import VisualButton from './visual-button.vue'

export default VisualButton

declare module 'vue' {
  export interface GlobalComponents {
    VisualButton: typeof VisualButton
  }
}
