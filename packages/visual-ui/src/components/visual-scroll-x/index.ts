import VisualScrollX from './visual-scroll-x.vue'
export type { VisualScrollXProps } from './interface'

export default VisualScrollX

declare module 'vue' {
  export interface GlobalComponents {
    VisualScrollX: typeof VisualScrollX
  }
}
