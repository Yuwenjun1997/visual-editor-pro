import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '地图',
  visualKey: 'VisualMap',
  dataType: 'object',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '纬度', propName: 'latitude' },
    { label: '经度', propName: 'longitude' },
  ],
}
export default schema
