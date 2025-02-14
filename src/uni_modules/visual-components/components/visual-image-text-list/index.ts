import VisualImageTextList from './visual-image-text-list.vue'

export default VisualImageTextList

declare module 'vue' {
  export interface GlobalComponents {
    VisualImageTextList: typeof VisualImageTextList
  }
}
