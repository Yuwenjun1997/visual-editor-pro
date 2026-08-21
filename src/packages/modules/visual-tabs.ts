import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualTabsProps } from '#visual-ui/components/visual-tabs/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createTextInputControl,
} from '@/utils/visual.control'

const visualTabs: VisualEditorComponent<VisualTabsProps> = {
  key: 'VisualTabs',
  moduleName: 'basicWidgets',
  componentName: 'VisualTabs',
  label: '页签切换',
  previewImage: '/componets/visual-tabs.svg',
  props: {
    activeKey: createNormalSelectControl({
      label: '默认页签',
      defaultValue: 'pane1',
      options: [
        { label: '页签一', value: 'pane1' },
        { label: '页签二', value: 'pane2' },
        { label: '页签三', value: 'pane3' },
      ],
    }),
    label1: createTextInputControl({ label: '页签一名称', defaultValue: '推荐' }),
    label2: createTextInputControl({ label: '页签二名称', defaultValue: '热销' }),
    label3: createTextInputControl({ label: '页签三名称', defaultValue: '新品' }),
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
  slots: {
    pane1: { name: '页签一', blocks: [] },
    pane2: { name: '页签二', blocks: [] },
    pane3: { name: '页签三', blocks: [] },
  },
}

export default visualTabs