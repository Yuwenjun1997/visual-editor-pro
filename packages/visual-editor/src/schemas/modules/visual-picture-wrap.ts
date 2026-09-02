import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '图片列表',
  visualKey: 'VisualPictureWrap',
  dataType: 'list',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '图片地址', propName: 'image' },
  ],
}
export default schema
