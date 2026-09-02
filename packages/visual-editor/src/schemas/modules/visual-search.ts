import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '搜索',
  visualKey: 'VisualSearch',
  dataType: 'object',
  schemas: [
    { label: '占位文本', propName: 'placeholder' },
    { label: '按钮文案', propName: 'buttonText' },
    { label: '跳转链接', propName: 'confirmLink' },
  ],
}
export default schema
