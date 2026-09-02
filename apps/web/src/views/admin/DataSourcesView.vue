<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div>
        <div class="wa-text-base wa-font-medium">数据源管理</div>
        <div class="wa-mt-1 wa-text-xs wa-text-gray-500">商品、文章只维护一次，页面按数据契约复用最新内容</div>
      </div>
      <el-button type="primary" @click="openCreate">新增数据源</el-button>
    </div>

    <el-table v-loading="loading" :data="sources">
      <el-table-column label="名称" prop="name" min-width="160" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ kindLabel(row as VisualDataSource) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据契约" min-width="150" prop="dataContract" />
      <el-table-column width="90" label="引用次数">
        <template #default="{ row }">{{ referenceCounts[(row as VisualDataSource).id] || 0 }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="(row as VisualDataSource).status === 'disabled' ? 'info' : 'success'">
            {{ (row as VisualDataSource).status === 'disabled' ? '已停用' : '启用中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row as VisualDataSource)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="remove(row as VisualDataSource)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" width="760px" destroy-on-close :title="editing ? '编辑数据源' : '新增数据源'">
      <el-form label-width="100px">
        <el-form-item label="数据源类型">
          <el-radio-group v-model="form.sourceKind" :disabled="!!editing">
            <el-radio-button value="entity_collection">业务集合</el-radio-button>
            <el-radio-button value="manual">静态数据</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="如：首页推荐商品" /></el-form-item>
        <template v-if="form.sourceKind === 'entity_collection'">
          <el-form-item label="业务类型">
            <el-radio-group v-model="form.entityType" :disabled="!!editing" @change="loadEntities">
              <el-radio-button value="product">商品</el-radio-button>
              <el-radio-button value="article">文章</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="筛选分类">
            <el-select v-model="form.categoryId" clearable placeholder="全部分类" style="width: 100%">
              <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="指定内容">
            <el-select
              v-model="form.entityIds"
              multiple
              clearable
              filterable
              style="width: 100%"
              placeholder="不指定则按规则取数"
            >
              <el-option v-for="item in entities" :key="item.id" :value="item.id" :label="item.title" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-select v-model="form.sort" style="width: 100%">
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量上限"><el-input-number v-model="form.limit" :min="1" :max="100" /></el-form-item>
        </template>
        <template v-else>
          <el-form-item label="组件 schema">
            <el-select
              v-model="form.schemaKey"
              filterable
              style="width: 100%"
              placeholder="请选择组件 schema"
              @change="selectSchema"
            >
              <el-option
                v-for="schema in schemas"
                :key="schema.visualKey"
                :label="schema.name"
                :value="schema.visualKey"
              />
            </el-select>
          </el-form-item>
          <template v-if="selectedSchema">
            <el-form-item label="数据形态">
              <el-tag>{{ selectedSchema.dataType === 'list' ? '对象数组' : '单对象' }}</el-tag>
            </el-form-item>
            <el-table v-if="selectedSchema.dataType === 'list'" border size="small" max-height="320" :data="manualRows">
              <el-table-column
                v-for="field in selectedSchema.schemas"
                :key="field.propName"
                :label="field.label"
                :prop="field.propName"
              >
                <template #default="{ row }"><el-input v-model="row[field.propName]" size="small" /></template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="{ $index }">
                  <el-button link type="danger" @click="manualRows.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              v-if="selectedSchema.dataType === 'list'"
              size="small"
              class="wa-w-full wa-mt-2"
              @click="addManualRow"
            >
              + 添加一项
            </el-button>
            <el-table v-else border size="small" :data="manualObjectRows">
              <el-table-column label="属性名" width="140" prop="label" />
              <!-- <el-table-column label="Key" width="160" prop="propName" /> -->
              <el-table-column label="值">
                <template #default="{ row }"><el-input v-model="row.value" size="small" /></template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else-if="legacyManual">
            <el-alert
              type="warning"
              class="wa-mb-3"
              :closable="false"
              title="旧数据契约未匹配到组件 schema，将保留原 JSON。请选择 schema 后再保存为新契约。"
            />
            <el-form-item label="旧数据契约"><el-input v-model="form.dataContract" disabled /></el-form-item>
            <el-form-item label="静态 JSON">
              <el-input v-model="form.manualJson" :rows="10" type="textarea" placeholder="对象或对象数组" />
            </el-form-item>
          </template>
          <el-empty v-else description="请选择组件 schema" />
          <div class="wa-ml-25 wa-mb-3 wa-text-xs wa-text-gray-500">
            仅当前数据源保存静态配置，不会随商品或文章后台自动同步。
          </div>
        </template>
      </el-form>
      <el-alert v-if="preview.length" title="当前命中预览" type="success" class="wa-mb-3" :closable="false">
        <template #default>
          共 {{ preview.length }} 条：{{ preview.map((item) => item.title || item.text || item.id).join('、') }}
        </template>
      </el-alert>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="form.sourceKind === 'entity_collection'" :loading="previewing" @click="previewSource">
          预览
        </el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getSchemas,
  type VisualDataSource,
  type VisualEntitySort,
  type VisualEntityType,
  type VisualSchema,
} from '@visual/editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryService, type CategoryOption } from '../../services/category.service'
import { productService } from '../../services/product.service'
import { articleService } from '../../services/article.service'
import { dataSourceService } from '../../services/data-source.service'
import { pageService } from '../../services/page.service'
import { useAuthStore } from '../../stores/auth'

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
      ? (await productService.list()).map((item) => ({ id: item.id, title: item.title }))
      : (await articleService.list()).map((item) => ({ id: item.id, title: item.title }))
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
        status: 'active' as const,
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
</script>
