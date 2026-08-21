import VisualObjectArray from './visual-object-array.vue'

export default VisualObjectArray

declare module 'vue' {
  export interface GlobalComponents {
    VisualObjectArray: typeof VisualObjectArray
  }
}
