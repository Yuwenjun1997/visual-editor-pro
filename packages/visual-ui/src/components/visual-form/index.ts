import VisualForm from './visual-form.vue'

export default VisualForm

declare module 'vue' {
  export interface GlobalComponents {
    VisualForm: typeof VisualForm
  }
}
