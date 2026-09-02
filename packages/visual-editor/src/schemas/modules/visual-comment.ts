import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '评论列表',
  visualKey: 'VisualComment',
  dataType: 'list',
  schemas: [
    { label: '头像', propName: 'avatar' },
    { label: '昵称', propName: 'nickname' },
    { label: '评论内容', propName: 'content' },
    { label: '时间', propName: 'time' },
    { label: '评分', propName: 'rating' },
  ],
}
export default schema
