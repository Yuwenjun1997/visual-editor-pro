import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type {
  VisualProductCardListItem,
  VisualProductCardListProps,
} from '@visual/ui/components/visual-product-card-list/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const createData = (): Record<Exclude<keyof VisualProductCardListItem, 'id'>, VisualEditorProps> => ({
  cover: createImageInputControl({ label: '商品图', defaultValue: defaultCover }),
  title: createTextInputControl({
    label: '商品标题',
    defaultValue: '科技渐变限量手办，遇见心动好物',
  }),
  price: createNumberInputControl({ label: '售价', defaultValue: 59.9 }),
  originPrice: createNumberInputControl({ label: '原价' }),
  tag: createTextInputControl({ label: '角标文案', defaultValue: '新品' }),
  buyLink: createTextInputControl({ label: '跳转链接' }),
})

const visualProductCardList: VisualEditorComponent<VisualProductCardListProps> = {
  key: 'VisualProductCardList',
  moduleName: 'commerceWidgets',
  componentName: 'VisualProductCardList',
  label: '商品卡片列表',
  previewImage: '/componets/visual-product-card-list.svg',
  dataContract: 'product-list',
  souceDataType: 'VisualObjectArray',
  props: {
    layout: createNormalSelectControl({
      label: '布局方式',
      options: [
        { label: '单列', value: 'col-1' },
        { label: '双列', value: 'col-2' },
        { label: '左右滑动', value: 'scroll-x' },
      ],
      defaultValue: 'col-2',
    }),
    cardWidth: createNormalSelectControl({
      label: '卡片宽度',
      options: [
        { label: '200px', value: '200px' },
        { label: '240px', value: '240px' },
        { label: '280px', value: '280px' },
        { label: '320px', value: '320px' },
        { label: '360px', value: '360px' },
      ],
      defaultValue: '240px',
    }),
    gutter: createNormalSelectControl({
      label: '商品间隙',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'md',
    }),
    showTag: createSwitchControl({ label: '显示角标', defaultValue: true }),
    showBuy: createSwitchControl({ label: '显示购买按钮', defaultValue: true }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '立即购买' }),
    round: createPxInputControl({ label: '圆角大小' }),
    currency: createTextInputControl({ label: '货币符号', defaultValue: '¥' }),
  },
  listData: {
    label: '商品卡片列表',
    data: [createData(), createData()],
    minLength: 2,
    maxLength: 12,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualProductCardList
