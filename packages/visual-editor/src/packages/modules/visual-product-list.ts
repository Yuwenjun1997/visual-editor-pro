import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type { VisualProductListItem, VisualProductListProps } from '@visual/ui/components/visual-product-list/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
  createUrlInputControl,
} from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const createData = (): Record<Exclude<keyof VisualProductListItem, 'id'>, VisualEditorProps> => ({
  cover: createImageInputControl({ label: '商品图', defaultValue: defaultCover }),
  title: createTextInputControl({
    label: '商品标题',
    defaultValue: '科技渐变限量手办，遇见心动好物',
  }),
  price: createNumberInputControl({ label: '售价', defaultValue: 59.9 }),
  originPrice: createNumberInputControl({ label: '原价' }),
  tag: createTextInputControl({ label: '角标文案', defaultValue: '新品' }),
  buyLink: createUrlInputControl({ label: '跳转链接' }),
})

const visualProductList: VisualEditorComponent<VisualProductListProps> = {
  key: 'VisualProductList',
  moduleName: 'commerceWidgets',
  componentName: 'VisualProductList',
  label: '商品列表',
  previewImage: '/componets/visual-product-list.svg',
  dataContract: 'product-list',
  souceDataType: 'VisualObjectArray',
  props: {
    coverInRight: createSwitchControl({ label: '图片居右' }),
    gutter: createNormalSelectControl({
      label: '间距',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'md',
    }),
    round: createPxInputControl({ label: '圆角大小' }),
    showTag: createSwitchControl({ label: '显示角标', defaultValue: true }),
    showBuy: createSwitchControl({ label: '显示购买按钮', defaultValue: true }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '立即购买' }),
    currency: createTextInputControl({ label: '货币符号', defaultValue: '¥' }),
  },
  listData: {
    label: '商品列表',
    data: [createData(), createData()],
    minLength: 1,
    maxLength: 12,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualProductList
