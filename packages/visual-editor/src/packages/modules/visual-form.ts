import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type { VisualFormField, VisualFormProps } from '@visual/ui/components/visual-form/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
  createUrlInputControl,
} from '../../utils/visual.control'

const createData = (): Record<keyof VisualFormField, VisualEditorProps> => ({
  label: createTextInputControl({ label: '字段名称', defaultValue: '姓名' }),
  fieldType: createNormalSelectControl({
    label: '输入类型',
    options: [
      { label: '文本', value: 'text' },
      { label: '手机号', value: 'phone' },
      { label: '多行文本', value: 'textarea' },
    ],
    defaultValue: 'text',
  }),
  placeholder: createTextInputControl({ label: '占位提示', defaultValue: '请输入姓名' }),
  required: createSwitchControl({ label: '必填', defaultValue: true }),
  maxLength: createNumberInputControl({ label: '最大长度', defaultValue: 50 }),
})

const visualForm: VisualEditorComponent<VisualFormProps> = {
  key: 'VisualForm',
  moduleName: 'serviceWidgets',
  componentName: 'VisualForm',
  label: '表单容器',
  previewImage: '/componets/visual-form.svg',
  souceDataType: 'VisualObjectArray',
  props: {
    submitText: createTextInputControl({ label: '提交按钮文案', defaultValue: '提交' }),
    submitButtonColor: createColorInputControl({
      label: '按钮颜色',
      defaultValue: '#2563EB',
    }),
    submitLink: createUrlInputControl({
      label: '提交地址',
      tips: '为空时提交仅提示',
    }),
    radius: createPxInputControl({ label: '圆角大小' }),
  },
  listData: {
    label: '表单项',
    data: [createData(), createData()],
    minLength: 1,
    maxLength: 8,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualForm
