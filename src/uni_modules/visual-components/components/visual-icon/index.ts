import VisualIcon from './visual-icon.vue'

export default VisualIcon

declare module 'vue' {
  export interface GlobalComponents {
    VisualIcon: typeof VisualIcon
  }
}
