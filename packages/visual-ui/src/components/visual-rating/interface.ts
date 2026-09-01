export { default as VisualRating } from './visual-rating.vue'
export interface VisualRatingProps {
  max?: number
  value?: number
  size?: string
  color?: string
  readonly?: boolean
  allowHalf?: boolean
}
