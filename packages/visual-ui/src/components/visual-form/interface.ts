export { default as VisualForm } from './visual-form.vue'
import type { VisualUrlValue } from '../../types/url'
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
  submitLink?: VisualUrlValue
  radius?: string
}
