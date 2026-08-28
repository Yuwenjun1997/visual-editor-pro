export { default as VisualTimeline } from './visual-timeline.vue'
export interface VisualTimelineItem {
  icon?: string
  title?: string
  desc?: string
  time?: string
  status?: 'done' | 'doing' | 'todo'
}
export interface VisualTimelineProps {
  showTime?: boolean
}