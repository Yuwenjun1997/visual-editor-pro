import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '评分',
  visualKey: 'VisualRating',
  dataType: 'object',
  schemas: [
    { label: '星星数量', propName: 'max' },
    { label: '默认评分', propName: 'value' },
  ],
}
export default schema
