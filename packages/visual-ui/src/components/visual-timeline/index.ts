import VisualTimeline from './visual-timeline.vue'

export default VisualTimeline

declare module 'vue' {
  export interface GlobalComponents {
    VisualTimeline: typeof VisualTimeline
  }
}
