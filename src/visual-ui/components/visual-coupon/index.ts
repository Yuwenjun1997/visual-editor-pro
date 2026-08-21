import VisualCoupon from './visual-coupon.vue'

export default VisualCoupon

declare module 'vue' {
  export interface GlobalComponents {
    VisualCoupon: typeof VisualCoupon
  }
}