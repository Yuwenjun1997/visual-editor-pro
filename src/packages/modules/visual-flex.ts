import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualFlexProps } from '#visual-ui/components/visual-flex/interface'
import {
  createNormalSelectControl,
  createPxInputControl,
} from '@/utils/visual.control'

const visualFlex: VisualEditorComponent<VisualFlexProps> = {
  key: 'VisualFlex',
  moduleName: 'basicWidgets',
  componentName: 'VisualFlex',
  label: '弹性布局',
  previewImage: '/componets/visual-flex.svg',
  props: {
    flexDirection: createNormalSelectControl({
      label: '排列方向',
      options: [
        { label: '水平', value: 'row' },
        { label: '垂直', value: 'column' },
        { label: '水平反转', value: 'row-reverse' },
        { label: '垂直反转', value: 'column-reverse' },
      ],
      defaultValue: 'row',
    }),
    justifyContent: createNormalSelectControl({
      label: '主轴对齐',
      options: [
        { label: '左对齐', value: 'flex-start' },
        { label: '居中对齐', value: 'center' },
        { label: '右对齐', value: 'flex-end' },
        { label: '两端对齐', value: 'space-between' },
        { label: '平均分布', value: 'space-around' },
      ],
    }),
    alignItems: createNormalSelectControl({
      label: '交叉轴对齐',
      options: [
        { label: '顶部对齐', value: 'flex-start' },
        { label: '居中对齐', value: 'center' },
        { label: '底部对齐', value: 'flex-end' },
      ],
    }),
    gap: createPxInputControl({ label: '间距' }),
  },
  slots: {
    default: {
      name: '内容',
      blocks: [],
    },
  },
}

export default visualFlex
