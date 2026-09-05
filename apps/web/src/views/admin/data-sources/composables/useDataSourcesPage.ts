import {
  getSchemas,
  type VisualDataSource,
  type VisualEntitySort,
  type VisualEntityType,
  type VisualSchema,
} from '@visual/editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryService, type CategoryOption } from '../../../../services/category.service'
import { productService } from '../../../../services/product.service'
import { articleService } from '../../../../services/article.service'
import { dataSourceService } from '../../../../services/data-source.service'
import { pageService } from '../../../../services/page.service'
import { useAuthStore } from '../../../../stores/auth'
export const useDataSourcesPage = () => {
  type Entity = { id: string; title: string }
  const auth = useAuthStore()
  const sources = ref<VisualDataSource[]>([])
  const referenceCounts = reactive<Record<string, number>>({})
  const categories = ref<CategoryOption[]>([])
  const entities = ref<Entity[]>([])
  const preview = ref<Record<string, any>[]>([])
  const visible = ref(false)
  const loading = ref(false)
  const saving = ref(false)
  const previewing = ref(false)
  const editing = ref<VisualDataSource | null>(null)
  const schemas = getSchemas().sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  const manualRows = ref<Record<string, any>[]>([])
  const manualObjectRows = ref<Array<{ label: string; propName: string; value: any }>>([])
  const preserveManualExtras = ref(false)
  const form = reactive({
    name: '',
    sourceKind: 'entity_collection' as 'entity_collection' | 'manual',
    entityType: 'product' as VisualEntityType,
    categoryId: null as string | null,
    entityIds: [] as string[],
    sort: 'manual' as VisualEntitySort,
    limit: 8,
    dataContract: 'manual-notice',
    manualJson: '[\n  {"text":"请输入公告内容"}\n]',
    schemaKey: '',
  })
  const selectedSchema = computed<VisualSchema | undefined>(() =>
    schemas.find((schema) => schema.visualKey === form.schemaKey),
  )
  const legacyManual = computed(() => !!editing.value && form.sourceKind === 'manual' && !selectedSchema.value)
  const sortOptions = computed(() =>
    form.entityType === 'product'
      ? [
          { label: '手动顺序', value: 'manual' },
          { label: '最新创建', value: 'newest' },
          { label: '价格从低到高', value: 'price_asc' },
          { label: '价格从高到低', value: 'price_desc' },
        ]
      : [
          { label: '发布时间倒序', value: 'newest' },
          { label: '手动顺序', value: 'manual' },
        ],
  )
  const kindLabel = (source: VisualDataSource) =>
    source.sourceKind === 'manual' ? '静态数据' : source.entityType === 'article' ? '文章集合' : '商品集合'
  const load = async () => {
    loading.value = true
    try {
      sources.value = await dataSourceService.list()
      const currentSources = sources.value as Array<{ id: string }>
      await Promise.all(
        currentSources.map(async (source) => {
          referenceCounts[source.id] = (await pageService.listBindings(source.id)).length
        }),
      )
    } catch (error: any) {
      ElMessage.error(error.message || '数据源加载失败')
    } finally {
      loading.value = false
    }
  }
  const loadEntities = async () => {
    categories.value = await categoryService.listByType(form.entityType)
    entities.value =
      form.entityType === 'product'
        ? (await productService.list()).items.map((item) => ({ id: item.id, title: item.title }))
        : (await articleService.list()).items.map((item) => ({ id: item.id, title: item.title }))
  }
  const resetForm = () => {
    Object.assign(form, {
      name: '',
      sourceKind: 'entity_collection',
      entityType: 'product',
      categoryId: null,
      entityIds: [],
      sort: 'manual',
      limit: 8,
      dataContract: 'manual-notice',
      manualJson: '[\n  {"text":"请输入公告内容"}\n]',
      schemaKey: '',
    })
    manualRows.value = []
    manualObjectRows.value = []
    preserveManualExtras.value = false
    preview.value = []
  }
  const parseManualJson = () => {
    try {
      return JSON.parse(form.manualJson)
    } catch {
      return undefined
    }
  }
  const selectSchema = (visualKey: string) => {
    const schema = schemas.find((item) => item.visualKey === visualKey)
    if (!schema) return
    form.dataContract = `manual-${schema.visualKey}`
    const current = parseManualJson()
    if (schema.dataType === 'list') {
      const rows = Array.isArray(current) ? current : []
      manualRows.value = rows.map((row) =>
        schema.schemas.reduce((result, field) => ({ ...result, [field.propName]: row?.[field.propName] ?? '' }), {}),
      )
    } else {
      const object = current && !Array.isArray(current) && typeof current === 'object' ? current : {}
      manualObjectRows.value = schema.schemas.map((field) => ({ ...field, value: object[field.propName] ?? '' }))
    }
    syncManualJson()
  }
  const addManualRow = () => {
    if (!selectedSchema.value) return
    manualRows.value.push(Object.fromEntries(selectedSchema.value.schemas.map((field) => [field.propName, ''])))
  }
  const syncManualJson = () => {
    if (!selectedSchema.value) return
    if (selectedSchema.value.dataType === 'list') {
      const current = preserveManualExtras.value ? parseManualJson() : []
      const currentRows = Array.isArray(current) ? current : []
      form.manualJson = JSON.stringify(
        manualRows.value.map((row, index) => ({
          ...(preserveManualExtras.value && currentRows[index] && typeof currentRows[index] === 'object'
            ? currentRows[index]
            : {}),
          ...row,
        })),
        null,
        2,
      )
    } else {
      const value = manualObjectRows.value.reduce((result, field) => ({ ...result, [field.propName]: field.value }), {})
      const current = preserveManualExtras.value ? parseManualJson() : {}
      form.manualJson = JSON.stringify(
        { ...(current && !Array.isArray(current) && typeof current === 'object' ? current : {}), ...value },
        null,
        2,
      )
    }
  }
  const syncManualEditor = (json: any) => {
    if (!selectedSchema.value) return
    if (selectedSchema.value.dataType === 'list') {
      manualRows.value = Array.isArray(json) ? json.map((row) => ({ ...row })) : []
    } else {
      const object = json && !Array.isArray(json) && typeof json === 'object' ? json : {}
      manualObjectRows.value = selectedSchema.value.schemas.map((field) => ({
        ...field,
        value: object[field.propName] ?? '',
      }))
    }
  }
  watch(manualRows, syncManualJson, { deep: true })
  watch(manualObjectRows, syncManualJson, { deep: true })
  const openCreate = async () => {
    editing.value = null
    resetForm()
    await loadEntities()
    visible.value = true
  }
  const openEdit = async (source: VisualDataSource) => {
    editing.value = source
    preserveManualExtras.value = true
    Object.assign(form, {
      name: source.name,
      sourceKind: source.sourceKind,
      entityType: source.entityType || 'product',
      categoryId: (source.queryConfig as any)?.categoryId || null,
      entityIds: (source.queryConfig as any)?.entityIds || [],
      sort: (source.queryConfig as any)?.sort || 'manual',
      limit: (source.queryConfig as any)?.limit || 8,
      dataContract: source.dataContract,
      manualJson: JSON.stringify(source.manualData ?? {}, null, 2),
      schemaKey: source.dataContract?.startsWith('manual-') ? source.dataContract.slice('manual-'.length) : '',
    })
    if (selectedSchema.value) syncManualEditor(parseManualJson())
    await loadEntities()
    visible.value = true
  }
  const buildPayload = (): any =>
    form.sourceKind === 'entity_collection'
      ? {
          name: form.name.trim(),
          sourceKind: 'entity_collection' as const,
          entityType: form.entityType,
          queryConfig: { categoryId: form.categoryId, entityIds: form.entityIds, sort: form.sort, limit: form.limit },
          dataContract: form.entityType === 'product' ? ('product-list' as const) : ('article-list' as const),
          manualData: null,
          status: editing.value?.status || ('active' as const),
          schemaVersion: 1,
        }
      : {
          name: form.name.trim(),
          sourceKind: 'manual' as const,
          entityType: null,
          queryConfig: {} as Record<string, never>,
          dataContract: (selectedSchema.value
            ? `manual-${selectedSchema.value.visualKey}`
            : form.dataContract.trim() || 'manual-notice') as `manual-${string}`,
          manualData: selectedSchema.value ? JSON.parse(form.manualJson) : JSON.parse(form.manualJson),
          status: 'active' as const,
          schemaVersion: 1,
        }
  const previewSource = async () => {
    try {
      previewing.value = true
      const payload = buildPayload()
      if (payload.sourceKind !== 'entity_collection') return
      preview.value = await dataSourceService.preview(payload)
    } catch (error: any) {
      ElMessage.error(error.message || '预览失败，请检查配置')
    } finally {
      previewing.value = false
    }
  }
  const save = async () => {
    if (!auth.user || !form.name.trim()) return ElMessage.warning('请填写数据源名称')
    try {
      if (form.sourceKind === 'manual' && !selectedSchema.value && !editing.value) {
        return ElMessage.warning('请选择组件 schema')
      }
      if (selectedSchema.value) syncManualJson()
      const payload = buildPayload()
      saving.value = true
      if (editing.value) await dataSourceService.update(editing.value.id, payload)
      else await dataSourceService.create({ ...payload, userId: auth.user.id })
      ElMessage.success('保存成功')
      visible.value = false
      await load()
    } catch (error: any) {
      ElMessage.error(error.message || '保存失败，请检查配置')
    } finally {
      saving.value = false
    }
  }
  const remove = async (source: VisualDataSource) => {
    try {
      const bindings = await pageService.listBindings(source.id)
      if (bindings.length) {
        const pages = bindings.map((item: any) => item.pages?.title || item.page_id).join('、')
        await ElMessageBox.alert(
          `该数据源正在被 ${bindings.length} 个页面引用：${pages}。请先解除或替换引用。`,
          '无法删除',
          { type: 'warning' },
        )
        return
      }
      await ElMessageBox.confirm(`确定删除数据源「${source.name}」吗？`, '删除确认', { type: 'warning' })
      await dataSourceService.remove(source.id)
      ElMessage.success('已删除')
      await load()
    } catch {}
  }
  onMounted(load)
  return {
    sources,
    referenceCounts,
    categories,
    entities,
    preview,
    visible,
    loading,
    saving,
    previewing,
    editing,
    schemas,
    manualRows,
    manualObjectRows,
    form,
    selectedSchema,
    legacyManual,
    sortOptions,
    kindLabel,
    loadEntities,
    selectSchema,
    addManualRow,
    openCreate,
    openEdit,
    previewSource,
    save,
    remove,
  }
}
