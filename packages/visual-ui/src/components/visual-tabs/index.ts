import VisualTabs from './visual-tabs.vue'

export default VisualTabs

declare module 'vue' {
  export interface GlobalComponents {
    VisualTabs: typeof VisualTabs
  }
}
