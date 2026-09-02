import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '二维码',
  visualKey: 'VisualQrcode',
  dataType: 'object',
  schemas: [{ label: '内容', propName: 'content' }],
}
export default schema
