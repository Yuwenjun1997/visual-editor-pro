import type { VisualUrlValue } from '../../types/url'

export interface VisualImageTextListProps {
  coverInRight?: boolean // 封面是否在右边
  backgroundColor?: string
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  showAuthor?: boolean
  showTime?: boolean
}

export interface VisualImageTextListItem {
  id?: string
  link?: VisualUrlValue
  cover: string
  title: string
  authorName: string
  authorAvatar: string
  publishTime: string
}
