import VisualImage from './visual-image.vue'

export default VisualImage

declare module 'vue' {
  export interface GlobalComponents {
    VisualImage: typeof VisualImage
  }
}
