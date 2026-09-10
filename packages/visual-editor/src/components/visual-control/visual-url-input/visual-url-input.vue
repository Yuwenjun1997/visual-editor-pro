<template>
  <div class="visual-url-input">
    <el-tooltip :content="detailLabel" placement="top" :disabled="!details">
      <el-button class="ve-w-full" @click="open">{{ summary }}</el-button>
    </el-tooltip>
    <el-dialog v-model="visible" width="520px" append-to-body title="选择跳转链接" @closed="reset">
      <el-radio-group v-model="draft.mode">
        <el-radio-button value="global-page">全局页面</el-radio-button>
        <el-radio-button value="app-page" :disabled="!appId">应用内页面</el-radio-button>
        <el-radio-button value="external">外部 URL</el-radio-button>
      </el-radio-group>
      <div class="ve-mt-4">
        <el-select
          v-if="draft.mode !== 'external'"
          v-model="draft.url"
          filterable
          class="ve-w-full"
          :loading="loading"
          :placeholder="draft.mode === 'global-page' ? '选择已发布全局页面' : '选择已发布应用页面'"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-else v-model="draft.url" placeholder="https://example.com 或站内地址" />
      </div>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!draft.url.trim()" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { VisualUrl, VisualUrlPageOption } from '../../../types/visual-editor'
import { normalizeVisualUrl } from '@visual/ui'
import { usePageConfig } from '../../../hooks/usePageConfig'
import { visualConfig } from '../../../utils/visual.registry'

const model = defineModel<VisualUrl | string | undefined>()
const visible = ref(false)
const loading = ref(false)
const options = ref<VisualUrlPageOption[]>([])
const displayOptions = ref<VisualUrlPageOption[]>([])
const { pageConfig } = usePageConfig()
const draft = reactive<VisualUrl>({ mode: 'external', url: '' })
const appId = computed(() => pageConfig.value.appId)
const summary = computed(() => {
  const target = normalizeVisualUrl(model.value)
  if (!target?.url) return '选择跳转链接'
  return target.mode === 'global-page' ? '全局页面' : target.mode === 'app-page' ? '应用内页面' : '外部 URL'
})
const details = computed(() => normalizeVisualUrl(model.value)?.url || '')
const detailLabel = computed(() => {
  const target = normalizeVisualUrl(model.value)
  if (!target?.url) return ''
  const option = [...options.value, ...displayOptions.value].find((item) => item.value === target.url)
  if (option) return option.label
  if (target.mode === 'app-page') {
    if (target.url === 'product-detail') return '商品详情'
    if (target.url === 'article-detail') return '文章详情'
    if (target.url === 'profile') return '个人中心'
    if (target.url === appId.value) return '首页'
  }
  return target.url
})

const loadOptions = async () => {
  const provider = visualConfig.urlPageProvider
  if (!provider || draft.mode === 'external') return (options.value = [])
  loading.value = true
  try {
    const nextOptions =
      draft.mode === 'global-page'
        ? await provider.listGlobalPages()
        : appId.value
          ? await provider.listAppPages(appId.value)
          : []
    options.value = nextOptions
    displayOptions.value = nextOptions
  } finally {
    loading.value = false
  }
}

const open = async () => {
  const current = normalizeVisualUrl(model.value)
  draft.mode = current?.mode || 'external'
  draft.url = current?.url || ''
  visible.value = true
  await loadOptions()
}

watch(
  () => draft.mode,
  () => {
    draft.url = ''
    void loadOptions()
  },
)

const confirm = () => {
  model.value = { mode: draft.mode, url: draft.url.trim() }
  visible.value = false
}

const reset = () => {
  options.value = []
}

onMounted(async () => {
  const current = normalizeVisualUrl(model.value)
  if (!current || current.mode === 'external') return
  draft.mode = current.mode
  await loadOptions()
})
</script>
