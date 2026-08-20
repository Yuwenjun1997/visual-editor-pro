import type {
  VisualEditorComponent,
  VisualEditorProps,
} from '@/types/visual-editor'
import type {
  VisualFormItem,
  VisualFormProps,
} from '@/uni_modules/visual-components/components/visual-form/interface'
import {
  createColorInputControl,
  createFormItemControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '@/utils/visual.control'
import { v4 as uuidv4 } from 'uuid'

const createData = (): Record<keyof VisualFormItem, VisualEditorProps> => ({
  name: createTextInputControl({ label: '属性名称', defaultValue: '' }),
  label: createTextInputControl({ label: '标签', defaultValue: '标签' }),
  option: createFormItemControl({
    label: '更多属性',
    defaultValue: {
      uuid: uuidv4(),
      type: 'visual-input',
      columns: [],
      columnSourceOptions: {
        dataSource: 'custom',
        httpMethod: 'GET',
      },
    },
  }),
})

const VisualForm: VisualEditorComponent<VisualFormProps> = {
  key: 'VisualForm',
  moduleName: 'basicWidgets',
  componentName: 'VisualForm',
  label: '个性表单',
  previewImage: '/image/block.svg',
  props: {
    labelWidth: createPxInputControl({ label: '标签宽度' }),
    labelColor: createColorInputControl({ label: '标签颜色' }),
    showLabel: createSwitchControl({ label: '显示标签', defaultValue: true }),
  },
  listData: {
    label: '表单项',
    data: [createData()],
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default VisualForm
