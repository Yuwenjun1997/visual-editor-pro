import VisualMap from './visual-map.vue'

export default VisualMap

declare module 'vue' {
  export interface GlobalComponents {
    VisualMap: typeof VisualMap
  }
}
