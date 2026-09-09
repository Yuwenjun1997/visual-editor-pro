import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '富文本',
  visualKey: 'VisualRichText',
  dataType: 'object',
  schemas: [{ label: '内容', propName: 'html' }],
}
export default schema
