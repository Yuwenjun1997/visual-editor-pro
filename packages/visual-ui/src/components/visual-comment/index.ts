import VisualComment from './visual-comment.vue'

export default VisualComment

declare module 'vue' {
  export interface GlobalComponents {
    VisualComment: typeof VisualComment
  }
}
