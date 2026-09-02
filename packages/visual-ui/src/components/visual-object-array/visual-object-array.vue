<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-object-array">
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
import { getErrorMsg, type JsonObjectArray } from '../../utils'
import { useVisualRequest } from '../../hooks/useVisualRequest'
import { transformCustomSlotObjectArray } from './utils'
import type { VisualObjectArrayProps } from './interface'

interface Props {
  styles?: CSSProperties
  props: VisualObjectArrayProps
  class?: string
}

defineOptions({
  name: 'VisualObjectArray',
})

const _props = defineProps<Props>()

const _slotData = ref<JsonObjectArray>()

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
    _slotData.value = response as JsonObjectArray
  } catch (error: any) {
    _errorMsg.value = getErrorMsg(error)
  } finally {
    _isLoading.value = false
  }
}

provide('slotObjectArray', readonly(_slotData))

defineExpose({
  loadData: _loadData,
})

watchEffect(() => {
  const { options } = _props.props
  if (options?.dataSource === 'custom') {
    _errorMsg.value = undefined
    _slotData.value = transformCustomSlotObjectArray(options)
  }
})
</script>

<style lang="scss" scoped>
.visual-object-array {
  .visual-error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--v-spacing-md);
    gap: var(--v-spacing-xs);

    img {
      width: 40px;
      height: 40px;
    }

    span {
      font-size: var(--v-text-xs);
      color: var(--v-text-3);
    }
  }
}
</style>
