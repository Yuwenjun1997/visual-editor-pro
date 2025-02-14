import type { VisualSourceOptions } from '@/uni_modules/visual-components/types'

const visible = ref<boolean>(false)

const modelValue = ref<VisualSourceOptions>({
  dataSource: 'custom',
  customDataType: 'VisualObject',
})

export const useSourceDataEditor = (visualKey?: string) => {
  const show = (payload: VisualSourceOptions) => {
    modelValue.value = payload
    modelValue.value.customDataType = visualKey as any
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return { visible, modelValue, show, hide }
}
