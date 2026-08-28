export { default as VisualCoupon } from './visual-coupon.vue'
export interface VisualCouponProps {
  amountText?: string
  currency?: string
  conditionText?: string
  titleText?: string
  btnText?: string
  cardBgColor?: string
  textColor?: string
  btnColor?: string
  showBtn?: boolean
  layout?: 'row' | 'column'
  edge?: 'plain' | 'notch'
  theme?: 'default' | 'pink' | 'gold' | 'cool'
  showBadge?: boolean
  badgeText?: string
  badgeColor?: string
}