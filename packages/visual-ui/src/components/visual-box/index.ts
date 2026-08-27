import VisualBox from './visual-box.vue'

export default VisualBox

declare module 'vue' {
  export interface GlobalComponents {
    VisualBox: typeof VisualBox
  }
}
