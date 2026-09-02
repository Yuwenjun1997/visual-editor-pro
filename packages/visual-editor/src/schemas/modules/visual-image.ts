import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '图片',
  visualKey: 'VisualImage',
  dataType: 'object',
  schemas: [{ label: '图片地址', propName: 'src' }],
}
export default schema
