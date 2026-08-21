import VisualMessage from './visual-message.vue'

export default VisualMessage

declare module 'vue' {
  export interface GlobalComponents {
    VisualMessage: typeof VisualMessage
  }
}
