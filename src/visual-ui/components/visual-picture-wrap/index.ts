import VisualPictureWrap from './visual-picture-wrap.vue'

export default VisualPictureWrap

declare module 'vue' {
  export interface GlobalComponents {
    VisualPictureWrap: typeof VisualPictureWrap
  }
}
