export { default as VisualComment } from './visual-comment.vue'
export interface VisualCommentItem {
  avatar?: string
  nickname?: string
  content?: string
  time?: string
  rating?: number
}
export interface VisualCommentProps {
  showTime?: boolean
  showRating?: boolean
}