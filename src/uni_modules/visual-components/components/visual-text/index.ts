import VisualText from './visual-text.vue'

export default VisualText

declare module 'vue' {
  export interface GlobalComponents {
    VisualText: typeof VisualText
  }
}
