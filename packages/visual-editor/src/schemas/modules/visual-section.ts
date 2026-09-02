import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '标题栏',
  visualKey: 'VisualSection',
  dataType: 'object',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '描述信息', propName: 'description' },
  ],
}
export default schema
