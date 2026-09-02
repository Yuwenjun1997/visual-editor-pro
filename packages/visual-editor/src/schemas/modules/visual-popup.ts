import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '弹窗',
  visualKey: 'VisualPopup',
  dataType: 'object',
  schemas: [
    { label: '背景图', propName: 'bgImage' },
    { label: '标题', propName: 'title' },
    { label: '描述', propName: 'description' },
    { label: '按钮文案', propName: 'buttonText' },
    { label: '按钮链接', propName: 'buttonLink' },
  ],
}
export default schema
