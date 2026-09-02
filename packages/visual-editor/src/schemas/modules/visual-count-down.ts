import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '倒计时',
  visualKey: 'VisualCountDown',
  dataType: 'object',
  schemas: [
    { label: '前置标题', propName: 'title' },
    { label: '结束时间', propName: 'endTime' },
    { label: '左侧图片', propName: 'image' },
  ],
}
export default schema
