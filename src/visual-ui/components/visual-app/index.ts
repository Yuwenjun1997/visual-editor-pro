import VisualApp from './visual-app.vue'

export default VisualApp

declare module 'vue' {
  export interface GlobalComponents {
    VisualApp: typeof VisualApp
  }
}
