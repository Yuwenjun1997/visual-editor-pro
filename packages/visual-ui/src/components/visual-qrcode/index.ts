import VisualQRCode from './visual-qrcode.vue'

export default VisualQRCode

declare module 'vue' {
  export interface GlobalComponents {
    VisualQRCode: typeof VisualQRCode
  }
}
