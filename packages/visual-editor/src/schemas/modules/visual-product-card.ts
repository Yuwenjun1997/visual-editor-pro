import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '商品卡片',
  visualKey: 'VisualProductCard',
  dataType: 'object',
  schemas: [
    { label: '商品图', propName: 'cover' },
    { label: '商品标题', propName: 'title' },
    { label: '售价', propName: 'price' },
    { label: '原价', propName: 'originPrice' },
    { label: '商品角标', propName: 'tag' },
    { label: '按钮文案', propName: 'buttonText' },
    { label: '商品链接', propName: 'buyLink' },
  ],
}
export default schema
