import VisualSection from './visual-section.vue'

export default VisualSection

declare module 'vue' {
  export interface GlobalComponents {
    VisualSection: typeof VisualSection
  }
}
