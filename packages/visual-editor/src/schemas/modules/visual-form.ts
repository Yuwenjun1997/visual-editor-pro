import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '表单',
  visualKey: 'VisualForm',
  dataType: 'object',
  schemas: [
    { label: '提交按钮文案', propName: 'submitText' },
    { label: '提交链接', propName: 'submitLink' },
  ],
}
export default schema
