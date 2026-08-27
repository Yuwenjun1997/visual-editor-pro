import VisualVideo from './visual-video.vue'

export default VisualVideo

declare module 'vue' {
  export interface GlobalComponents {
    VisualVideo: typeof VisualVideo
  }
}
