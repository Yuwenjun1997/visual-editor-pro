import type { VisualSchema } from '../../types/visual-editor'

const schema: VisualSchema = {
  name: '商品卡片列表',
  visualKey: 'VisualProductCardList',
  schemas: [
    { label: '商品封面', propName: 'cover' },
    { label: '商品标题', propName: 'title' },
    { label: '售价', propName: 'price' },
    { label: '原价', propName: 'originPrice' },
    { label: '商品角标', propName: 'tag' },
    { label: '商品链接', propName: 'buyLink' },
  ],
}

export default schema
