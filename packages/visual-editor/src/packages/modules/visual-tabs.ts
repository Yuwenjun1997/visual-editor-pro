import type { VisualEditorComponent } from '../../types/visual-editor'
import type {
  VisualTabListDataItem,
  VisualTabsProps,
} from '@visual/ui/components/visual-tabs/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createTextInputControl,
} from '../../utils/visual.control'

const createListDataItem = (
  label: string
): Record<keyof VisualTabListDataItem, any> => ({
  label: createTextInputControl({ label: '页签名称', defaultValue: label }),
})

const visualTabs: VisualEditorComponent<VisualTabsProps> = {
  key: 'VisualTabs',
  moduleName: 'basicWidgets',
  componentName: 'VisualTabs',
  label: '页签切换',
  previewImage: '/componets/visual-tabs.svg',
  props: {
    type: createNormalSelectControl({
      label: '页签样式',
      defaultValue: 'line',
      options: [
        { label: '下划线', value: 'line' },
        { label: '胶囊', value: 'pill' },
      ],
    }),
    activeColor: createColorInputControl({ label: '激活色', defaultValue: '#409eff' }),
    textColor: createColorInputControl({ label: '文字颜色', defaultValue: '#666666' }),
  },
  listData: {
    label: '页签数据',
    data: [
      createListDataItem('推荐'),
      createListDataItem('热销'),
      createListDataItem('新品'),
    ],
    minLength: 1,
    maxLength: 10,
    addData() {
      this.data.push(createListDataItem('新页签'))
    },
    removeData(index: number) {
      this.data.splice(index, 1)
    },
  },
}

export default visualTabs