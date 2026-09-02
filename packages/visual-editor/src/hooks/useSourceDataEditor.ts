import type { VisualSourceOptions } from '@visual/ui/types'
import { visualConfig } from '../utils/visual.registry'

const visible = ref<boolean>(false)

const modelValue = ref<VisualSourceOptions>({
  dataSource: 'custom',
  customDataType: 'VisualObject',
})

export const useSourceDataEditor = (visualKey?: string) => {
  const show = (payload: VisualSourceOptions) => {
    modelValue.value = payload
    const component = visualKey ? visualConfig.componentMap[visualKey] : undefined
    modelValue.value.customDataType = component?.souceDataType || 'VisualObject'
    modelValue.value.dataContract = component?.dataContract || `manual-${visualKey || 'object'}`
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return { visible, modelValue, show, hide }
}
