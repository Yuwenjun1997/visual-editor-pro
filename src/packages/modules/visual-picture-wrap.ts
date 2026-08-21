import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '@/types/visual-editor'
import type {
  VisualPicture,
  VisualPictureWrapProps,
} from '#visual-ui/components/visual-picture-wrap/interface'
import {
  createColorInputControl,
  createImageInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const defaultCover = '/image/cover.svg'

const createData = (): Record<keyof VisualPicture, VisualEditorProps> => ({
  label: createTextInputControl({
    label: '标题',
    defaultValue: '举杯邀明月，对影成三人',
  }),
  url: createImageInputControl({
    label: '图片地址',
    defaultValue: defaultCover,
  }),
})

const visualPictureWrap: VisualEditorComponent<VisualPictureWrapProps> = {
  key: 'VisualPictureWrap',
  moduleName: 'imageTextWidgets',
  componentName: 'VisualPictureWrap',
  label: '照片墙',
  previewImage: '/componets/visual-picture-wrap.svg',
  styles: {
    backgroundColor: '#f9f9f9',
  },
  props: {
    layout: createNormalSelectControl({
      label: '列表类型',
      options: [
        { label: '样式一', value: 'layout-card-type-one' },
        { label: '样式二', value: 'layout-card-type-two' },
        { label: '样式三', value: 'layout-card-type-three' },
        { label: '样式四', value: 'layout-card-type-four' },
        { label: '样式五', value: 'layout-card-type-scroll-x' },
      ],
      defaultValue: 'layout-card-type-one',
    }),
    showLabel: createSwitchControl({ label: '显示标签', defaultValue: false }),
    bgColor: createColorInputControl({ label: '背景色' }),
    gutter: createNormalSelectControl({
      label: '图片间隙',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
      defaultValue: 'base',
    }),
    radius: createNormalSelectControl({
      label: '圆角大小',
      options: [
        { label: '超小', value: 'xs' },
        { label: '较小', value: 'sm' },
        { label: '适中', value: 'md' },
        { label: '默认', value: 'base' },
        { label: '较大', value: 'lg' },
      ],
    }),
    height: createPxInputControl({ label: '图片高度' }),
  },
  listData: {
    label: '图片列表',
    data: [createData(), createData()],
    maxLength: 6,
    minLength: 2,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualPictureWrap
