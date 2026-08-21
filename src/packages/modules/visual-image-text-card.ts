import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '@/types/visual-editor'
import type {
  VisualImageTextCardItem,
  VisualImageTextCardProps,
} from '#visual-ui/components/visual-image-text-card/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const defaultCover = '/image/cover.svg'

const createData = (): Record<
  keyof VisualImageTextCardItem,
  VisualEditorProps
> => ({
  authorAvatar: createImageInputControl({
    label: '作者头像',
    defaultValue: defaultCover,
  }),
  authorName: createTextInputControl({
    label: '作者名称',
    defaultValue: '作者名称',
  }),
  cover: createImageInputControl({
    label: '封面图片',
    defaultValue: defaultCover,
  }),
  publishTime: createTextInputControl({
    label: '发布时间',
    defaultValue: '今天',
  }),
  title: createTextInputControl({
    label: '标题',
    defaultValue: '举杯邀明月，对影成三人',
  }),
})

const VisualImageTextCard: VisualEditorComponent<VisualImageTextCardProps> = {
  key: 'VisualImageTextCard',
  moduleName: 'imageTextWidgets',
  componentName: 'VisualImageTextCard',
  label: '图文卡片',
  previewImage: '/componets/visual-image-text-card.svg',
  souceDataType: 'VisualObjectArray',
  styles: {
    backgroundColor: '#f9f9f9',
  },
  props: {
    layout: createNormalSelectControl({
      label: '布局方式',
      options: [
        { label: '单列', value: 'col-1' },
        { label: '双列', value: 'col-2' },
        { label: '左右滑动', value: 'scroll-x' },
      ],
      defaultValue: 'col-1',
    }),
    cardStyle: createNormalSelectControl({
      label: '卡片风格',
      options: [
        { label: '简约', value: 'simple' },
        { label: '小清新', value: 'partysu' },
      ],
      defaultValue: 'simple',
    }),
    coverHeight: createPxInputControl({ label: '封面高度' }),
    gutter: createNormalSelectControl({
      label: '间距',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'base',
    }),
    round: createNormalSelectControl({
      label: '圆角',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
    }),
    showAuthor: createSwitchControl({
      label: '显示作者',
      defaultValue: true,
    }),
    showTime: createSwitchControl({
      label: '显示时间',
      defaultValue: true,
    }),
  },
  listData: {
    label: '图文列表',
    data: [createData(), createData()],
    maxLength: 8,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default VisualImageTextCard
