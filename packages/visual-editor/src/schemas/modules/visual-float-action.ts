import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '悬浮按钮',
  visualKey: 'VisualFloatAction',
  dataType: 'object',
  schemas: [
    { label: '电话号码', propName: 'phone' },
    { label: '跳转链接', propName: 'link' },
  ],
}
export default schema
