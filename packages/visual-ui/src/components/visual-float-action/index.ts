import VisualFloatAction from './visual-float-action.vue'

export default VisualFloatAction

declare module 'vue' {
  export interface GlobalComponents {
    VisualFloatAction: typeof VisualFloatAction
  }
}
