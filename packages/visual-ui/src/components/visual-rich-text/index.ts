import VisualRichText from './visual-rich-text.vue'

export default VisualRichText

declare module 'vue' {
  export interface GlobalComponents {
    VisualRichText: typeof VisualRichText
  }
}
