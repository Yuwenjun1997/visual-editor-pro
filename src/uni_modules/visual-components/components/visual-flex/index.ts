import VisualFlex from './visual-flex.vue'

export default VisualFlex

declare module 'vue' {
  export interface GlobalComponents {
    VisualFlex: typeof VisualFlex
  }
}
