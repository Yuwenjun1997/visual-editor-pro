import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '../../types/visual-editor'
import type {
  VisualMapMarker,
  VisualMapProps,
} from '@visual/ui/components/visual-map/interface'
import {
  createColorInputControl,
  createImageInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultIconPath = '/image/location.svg'

const createData = (): Record<keyof VisualMapMarker, VisualEditorProps> => ({
  iconPath: createImageInputControl({
    label: '图标',
    defaultValue: defaultIconPath,
  }),
  latitude: createNumberInputControl({ label: '纬度' }),
  longitude: createNumberInputControl({ label: '经度' }),
  title: createTextInputControl({ label: '标题' }),
})

const VisualMap: VisualEditorComponent<VisualMapProps> = {
  key: 'VisualMap',
  moduleName: 'basicWidgets',
  componentName: 'VisualMap',
  label: '地图',
  previewImage: '/componets/visual-map.svg',
  props: {
    autoLocation: createSwitchControl({
      label: '自动定位',
      defaultValue: false,
    }),
    title: createTextInputControl({
      label: '标题',
      defaultValue: '当前位置',
    }),
    latitude: createNumberInputControl({
      label: '纬度',
      defaultValue: 39.909,
    }),
    longitude: createNumberInputControl({
      label: '经度',
      defaultValue: 116.39742,
    }),
    titleColor: createColorInputControl({ label: '标题颜色' }),
    titleFontSize: createTextInputControl({ label: '标题字号' }),
    scale: createTextInputControl({ label: '缩放级别' }),
    width: createPxInputControl({ label: '地图宽度' }),
    height: createPxInputControl({ label: '地图高度' }),
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
    align: createNormalSelectControl({
      label: '对齐方式',
      options: [
        { label: '左对齐', value: 'flex-start' },
        { label: '居中对齐', value: 'center' },
        { label: '右对齐', value: 'flex-end' },
      ],
    }),
  },
  listData: {
    label: '地图标记点',
    data: [],
    maxLength: 8,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default VisualMap
