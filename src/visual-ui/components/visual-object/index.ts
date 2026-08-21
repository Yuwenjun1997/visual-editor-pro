import VisualObject from './visual-object.vue'

export default VisualObject

declare module 'vue' {
  export interface GlobalComponents {
    VisualObject: typeof VisualObject
  }
}
