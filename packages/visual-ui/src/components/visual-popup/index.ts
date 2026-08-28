import VisualPopup from './visual-popup.vue'

export default VisualPopup

declare module 'vue' {
  export interface GlobalComponents {
    VisualPopup: typeof VisualPopup
  }
}