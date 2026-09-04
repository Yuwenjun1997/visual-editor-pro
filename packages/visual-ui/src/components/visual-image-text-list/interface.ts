export interface VisualImageTextListProps {
  coverInRight?: boolean // 封面是否在右边
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  showAuthor?: boolean
  showTime?: boolean
}

export interface VisualImageTextListItem {
  id?: string
  link?: string
  cover: string
  title: string
  authorName: string
  authorAvatar: string
  publishTime: string
}
