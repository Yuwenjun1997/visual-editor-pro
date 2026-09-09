<template>
  <el-select
    v-model="model"
    remote
    clearable
    filterable
    reserve-keyword
    :loading="loading"
    placeholder="选择内容"
    :remote-method="search"
    class="visual-remote-entity-select"
    @visible-change="handleVisibleChange"
  >
    <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.title" />
    <template #empty>
      <span class="visual-remote-entity-select__empty">{{ error || '暂无可选内容' }}</span>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { VisualEntityOption, VisualEntityType } from '../../../types/visual-editor'
import { visualConfig } from '../../../utils/visual.registry'

const model = defineModel<string>({ default: '' })
const props = defineProps<{ entityType: VisualEntityType }>()
const options = ref<VisualEntityOption[]>([])
const loading = ref(false)
const error = ref('')
let requestId = 0

const load = async (keyword = '') => {
  const provider = visualConfig.entityProvider
  if (!provider) {
    error.value = '内容服务不可用'
    return
  }
  const currentRequest = ++requestId
  loading.value = true
  error.value = ''
  try {
    const rows = await provider.list(props.entityType, keyword)
    if (currentRequest === requestId) options.value = rows
  } catch {
    if (currentRequest === requestId) error.value = '内容加载失败，请重试'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

const ensureSelectedOption = async () => {
  const id = model.value
  const provider = visualConfig.entityProvider
  if (!id || !provider || options.value.some((item) => item.id === id)) return
  try {
    const option = await provider.get(props.entityType, id)
    if (option && model.value === id) options.value = [option, ...options.value]
  } catch {
    // The persisted ID may no longer be available to the current user.
  }
}

const search = useDebounceFn((keyword: string) => void load(keyword), 250)
const handleVisibleChange = (visible: boolean) => {
  if (visible) void load()
}

watch([model, () => props.entityType], ensureSelectedOption, { immediate: true })
onMounted(() => void load())
</script>

<style scoped lang="scss">
.visual-remote-entity-select {
  width: 100%;
}
.visual-remote-entity-select__empty {
  display: block;
  padding: 8px 12px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
