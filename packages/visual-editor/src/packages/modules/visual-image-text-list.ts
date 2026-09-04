import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type {
  VisualImageTextListItem,
  VisualImageTextListProps,
} from '@visual/ui/components/visual-image-text-list/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const createData = (): Record<Exclude<keyof VisualImageTextListItem, 'id' | 'link'>, VisualEditorProps> => ({
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

const VisualImageTextList: VisualEditorComponent<VisualImageTextListProps> = {
  key: 'VisualImageTextList',
  moduleName: 'imageTextWidgets',
  componentName: 'VisualImageTextList',
  label: '图文列表',
  previewImage: '/componets/visual-image-text-list.svg',
  dataContract: 'article-list',
  souceDataType: 'VisualObjectArray',
  props: {
    coverInRight: createSwitchControl({
      label: '封面居右',
    }),
    showAuthor: createSwitchControl({
      label: '显示作者',
      defaultValue: true,
    }),
    showTime: createSwitchControl({
      label: '显示时间',
      defaultValue: true,
    }),
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

export default VisualImageTextList
