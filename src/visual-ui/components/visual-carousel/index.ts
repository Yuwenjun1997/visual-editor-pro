import VisualCarousel from './visual-carousel.vue'

export default VisualCarousel

declare module 'vue' {
  export interface GlobalComponents {
    VisualCarousel: typeof VisualCarousel
  }
}
