import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '按钮',
  visualKey: 'VisualButton',
  dataType: 'object',
  schemas: [
    { label: '按钮文案', propName: 'text' },
    { label: '跳转链接', propName: 'link' },
  ],
}
export default schema
