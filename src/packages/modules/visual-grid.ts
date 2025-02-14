import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '@/types/visual-editor'
import type {
  VisualGridItemProps,
  VisualGridProps,
} from '@/uni_modules/visual-components/components/visual-grid/interface'
import {
  createColorInputControl,
  createIconInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'

const defaultCover = '/static/image/cover.svg'

const createListData = (): Record<
  keyof VisualGridItemProps,
  VisualEditorProps
> => ({
  icon: createIconInputControl({
    label: '图标名称',
    defaultValue: defaultCover,
  }),
  text: createTextInputControl({ label: '文字', defaultValue: '文字' }),
})

const visualGrid: VisualEditorComponent<VisualGridProps> = {
  key: 'VisualGrid',
  moduleName: 'basicWidgets',
  componentName: 'VisualGrid',
  label: '宫格',
  previewImage: '/static/image/block.svg',
  souceDataType: 'VisualObjectArray',
  slots: {
    default: {
      name: '组件',
      size: 1,
      blocks: [],
    },
  },
  props: {
    columnNum: createTextInputControl({ label: '列数', defaultValue: '4' }),
    showBorder: createSwitchControl({ label: '显示边框', defaultValue: true }),
    fontSize: createPxInputControl({ label: '文字大小', defaultValue: '14px' }),
    iconSize: createPxInputControl({ label: '图标大小', defaultValue: '20px' }),
    fontColor: createColorInputControl({ label: '文字颜色' }),
    iconColor: createColorInputControl({ label: '图标颜色' }),
    direction: createNormalSelectControl({
      label: '排列方向',
      options: [
        { label: '横向', value: 'row' },
        { label: '纵向', value: 'column' },
      ],
      defaultValue: 'column',
    }),
  },
  listData: {
    label: '宫格数据',
    data: [
      createListData(),
      createListData(),
      createListData(),
      createListData(),
    ],
    minLength: 1,
    addData() {
      this.data.push(createListData())
    },
    removeData(index: number) {
      this.data.splice(index, 1)
    },
  },
}

export default visualGrid
