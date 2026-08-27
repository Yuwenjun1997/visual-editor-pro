import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '../../types/visual-editor'
import type {
  VisualCarouselItem,
  VisualCarouselProps,
} from '@visual/ui/components/visual-carousel/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const createListData = (): Record<
  keyof VisualCarouselItem,
  VisualEditorProps
> => ({
  image: createImageInputControl({
    label: '图片地址',
    defaultValue: defaultCover,
  }),
  title: createTextInputControl({
    label: '图片标题',
    defaultValue: '举杯邀明月，对影成三人',
  }),
})

const visualCarousel: VisualEditorComponent<
  VisualCarouselProps,
  VisualCarouselItem
> = {
  key: 'VisualCarousel',
  moduleName: 'basicWidgets',
  componentName: 'VisualCarousel',
  label: '轮播图',
  previewImage: '/componets/visual-carousel.svg',
  souceDataType: 'VisualObjectArray',
  props: {
    autoplay: createSwitchControl({ label: '自动切换', defaultValue: true }),
    interval: createTextInputControl({ label: '自动切换间隔' }),
    duration: createTextInputControl({ label: '滑动动画时长' }),
    circular: createSwitchControl({ label: '衔接滑动', defaultValue: true }),
    vertical: createSwitchControl({ label: '纵向滑动' }),
    height: createPxInputControl({ label: '图片高度' }),
    gap: createPxInputControl({ label: '图片间距' }),
    radius: createPxInputControl({ label: '图片圆角' }),
    indicatorDots: createSwitchControl({ label: '指示点', defaultValue: true }),
    indicatorDotsType: createNormalSelectControl({
      label: '指示点样式',
      options: [
        { label: '圆点', value: 'dot' },
        { label: '线条', value: 'line' },
        { label: '数字', value: 'number' },
        { label: '标题', value: 'title' },
        { label: '固定右边', value: 'fixed-right' },
      ],
      defaultValue: 'dot',
    }),
  },
  listData: {
    data: [createListData(), createListData()],
    label: '轮播图列表',
    addData() {
      this.data.push(createListData())
    },
    removeData(index: number) {
      this.data.splice(index, 1)
    },
  },
}

export default visualCarousel
