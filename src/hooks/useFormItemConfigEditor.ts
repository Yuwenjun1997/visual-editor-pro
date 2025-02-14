import type {
  VisualFormItem,
  VisualFormItemOption,
} from '@/uni_modules/visual-components/components/visual-form/interface'

const visible = ref<boolean>(false)

const modelValue = ref<VisualFormItemOption>({
  columnSourceOptions: {
    dataSource: 'custom',
  },
})

export const useFormItemConfigEditor = (visualKey?: string) => {
  const show = (payload: VisualFormItemOption) => {
    modelValue.value = payload
    console.log(modelValue.value)
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return { visible, modelValue, show, hide }
}
