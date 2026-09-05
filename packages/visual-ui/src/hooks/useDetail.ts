import { computed, ref, watch, onServerPrefetch } from 'vue'
import { useH5Runtime } from './useH5Runtime'
export const useDetail = (kind: 'product' | 'article', getId: () => string | undefined) => {
  const runtime = useH5Runtime()
  const id = computed(() => getId() || (runtime.detail?.value?.kind === kind ? runtime.detail.value.id : ''))
  const item = ref<Record<string, any> | null>(null)
  const loading = ref(false)
  const error = ref('')
  let sequence = 0
  let pending: Promise<void> = Promise.resolve()
  const load = async () => {
    const current = ++sequence
    item.value = null
    error.value = ''
    loading.value = false
    if (!id.value) return
    const context = runtime.detail?.value
    if (context?.kind === kind && context.id === id.value) {
      item.value = context.item
      return
    }
    if (!runtime.$detail) {
      error.value = '请在应用运行环境中查看详情'
      return
    }
    loading.value = true
    try {
      const data = await runtime.$detail(kind, id.value)
      if (current === sequence) item.value = data
    } catch {
      if (current === sequence) error.value = '内容不存在、未发布或加载失败'
    } finally {
      if (current === sequence) loading.value = false
    }
  }
  watch(
    [id, () => runtime.detail?.value],
    () => {
      pending = load()
    },
    { immediate: true },
  )
  onServerPrefetch(() => pending)
  return { id, item, loading, error, load }
}
