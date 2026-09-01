export { default as VisualQRCode } from './visual-qrcode.vue'
export interface VisualQRCodeProps {
  content?: string
  size?: number
  margin?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  fgColor?: string
  bgColor?: string
}
