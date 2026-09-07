export interface VisualUserCardProps {
  /** 留空时使用当前登录用户 */
  userId?: string
  title?: string
  buttonText?: string
  background?: string
  layout?: 'horizontal' | 'vertical'
}
