import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '公告栏',
  visualKey: 'VisualNoticeBar',
  dataType: 'object',
  schemas: [{ label: '公告内容', propName: 'text' }],
}
export default schema
