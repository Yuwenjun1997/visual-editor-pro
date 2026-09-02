import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '统计卡片',
  visualKey: 'VisualStatCard',
  dataType: 'object',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '数值', propName: 'value' },
    { label: '环比说明', propName: 'delta' },
  ],
}
export default schema
