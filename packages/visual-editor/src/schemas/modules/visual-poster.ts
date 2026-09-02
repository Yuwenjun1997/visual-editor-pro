import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '海报',
  visualKey: 'VisualPoster',
  dataType: 'object',
  schemas: [
    { label: '背景图', propName: 'bgImage' },
    { label: '标题', propName: 'title' },
    { label: '副标题', propName: 'subtitle' },
    { label: '底部文案', propName: 'footerText' },
    { label: '二维码内容', propName: 'qrContent' },
    { label: '按钮文案', propName: 'buttonText' },
    { label: '跳转链接', propName: 'shareLink' },
  ],
}
export default schema
