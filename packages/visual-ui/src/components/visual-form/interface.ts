export { default as VisualForm } from './visual-form.vue'
export interface VisualFormField {
  label?: string
  fieldType?: 'text' | 'phone' | 'textarea'
  placeholder?: string
  required?: boolean
  maxLength?: number
}
export interface VisualFormProps {
  submitText?: string
  submitButtonColor?: string
  submitLink?: string
  radius?: string
}