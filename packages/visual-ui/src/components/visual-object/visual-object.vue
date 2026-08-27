<template>
  <visual-box class="visual-object" :styles="_props.styles">
    <visual-message v-if="_errorMsg" message-type="request-error">
      <span>发现错误：{{ _errorMsg || '未知错误' }}</span>
    </visual-message>
    <slot v-else />
  </visual-box>
</template>

<script setup lang="ts">
import VisualMessage from '../visual-message/visual-message.vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { CSSProperties } from 'vue'
import { getErrorMsg, type JsonObject, type JsonObjectArray } from '../../utils'
import { useVisualRequest } from '../../hooks/useVisualRequest'
import { transformCustomSlotObject } from './utils'
import type { VisualObjectProps } from './interface'

interface Props {
  styles?: CSSProperties
  props: VisualObjectProps
}

defineOptions({
  name: 'VisualObject',
})

const _props = defineProps<Props>()

const _slotData = ref<JsonObject | JsonObjectArray>()

const _isLoading = ref<boolean>(false)
const _errorMsg = ref<string>()

const _loadData = async () => {
  try {
    if (!_props.props.options) return
    _errorMsg.value = undefined
    if (!_props.props.options.httpRequest) return
    _isLoading.value = true
    const { request } = useVisualRequest(_props.props.options)
    const response = await request()
    _slotData.value = response as any
  } catch (error: any) {
    _errorMsg.value = getErrorMsg(error)
  } finally {
    _isLoading.value = false
  }
}

provide('slotObject', readonly(_slotData))

defineExpose({
  loadData: _loadData,
})

watchEffect(() => {
  const { options } = _props.props
  if (options?.dataSource === 'custom') {
    _errorMsg.value = undefined
    _slotData.value = transformCustomSlotObject(options)
  }
})
</script>
