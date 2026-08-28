import VisualNoticeBar from './visual-notice-bar.vue'

export default VisualNoticeBar

declare module 'vue' {
  export interface GlobalComponents {
    VisualNoticeBar: typeof VisualNoticeBar
  }
}