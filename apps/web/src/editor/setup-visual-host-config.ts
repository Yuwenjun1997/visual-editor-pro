import { createPageSlug, isValidPageSlug, normalizePageSlug, visualConfig } from '@visual/editor'
import type { PageSchema, VisualPublishResult, VisualSaveResult } from '@visual/editor'
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'
import router from '../router'
import { articleService } from '../services/article.service'
import { appService } from '../services/app.service'
import { businessDataService } from '../services/business-data.service'
import { dataSourceService } from '../services/data-source.service'
import { pageService } from '../services/page.service'
import { productService } from '../services/product.service'
import type { useAuthStore } from '../stores/auth'
import { pickImageFromLibrary } from '../composables/image-library-picker'

const isUuid = (value: string | number): boolean =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

const requestPageMeta = async (initialTitle: string, initialSlug: string) => {
  const title = ref(initialTitle || '未命名页面')
  const slug = ref(initialSlug || createPageSlug())

  const action = await ElMessageBox({
    title: '保存页面',
    customClass: 'page-meta-message-box wa-w-[420px] wa-max-w-[calc(100vw-32px)]',
    message: h('div', { class: 'wa-block wa-w-full wa-flex wa-flex-col wa-gap-2 wa-py-1' }, [
      h('label', { class: 'wa-mt-1 wa-text-sm' }, '页面标题'),
      h(ElInput, {
        modelValue: title.value,
        maxlength: 40,
        placeholder: '请输入页面标题',
        'show-word-limit': true,
        'onUpdate:modelValue': (value: string) => (title.value = value),
        class: 'wa-w-full',
      }),
      h('label', { class: 'wa-mt-2 wa-text-sm' }, '页面地址'),
      h(ElInput, {
        modelValue: slug.value,
        placeholder: '只能使用小写字母、数字和连字符',
        'onUpdate:modelValue': (value: string) => (slug.value = value),
        class: 'wa-w-full',
      }),
    ]),
    showCancelButton: true,
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    distinguishCancelAndClose: true,
    beforeClose: (action, _instance, done) => {
      if (action === 'confirm') {
        const normalizedTitle = title.value.trim()
        const normalizedSlug = normalizePageSlug(slug.value)
        if (!normalizedTitle) {
          ElMessage.warning('页面标题不能为空')
          return
        }
        if (!isValidPageSlug(normalizedSlug)) {
          ElMessage.warning('页面地址不合法，只能使用小写字母、数字和连字符')
          return
        }
      }
      done()
    },
  }).catch(() => null)

  if (!action || action !== 'confirm') return null
  return {
    title: title.value.trim().slice(0, 40) || '未命名页面',
    slug: normalizePageSlug(slug.value),
  }
}

export const setupVisualHostConfig = (authStore: ReturnType<typeof useAuthStore>) => {
  visualConfig.imagePicker = pickImageFromLibrary
  visualConfig.onSave = async (data) => {
    if (!authStore.user) {
      router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      return
    }

    let title = (data.title || '').trim()
    let slug = normalizePageSlug(data.slug || '')
    if (!title || !isValidPageSlug(slug)) {
      const pageMeta = await requestPageMeta(title, slug)
      if (!pageMeta) return
      title = pageMeta.title
      slug = pageMeta.slug
    }

    const blocks = await businessDataService.migrateLegacyBusinessRefs(data.blocks, authStore.user.id)
    const schema: PageSchema = { ...data, title, slug, blocks }
    const pageId = await pageService.saveWithBindings({
      pageId: isUuid(data.pageId) ? String(data.pageId) : null,
      title,
      schema,
    })

    ElMessage.success('保存成功')
    return { pageId, title, slug, blocks } as VisualSaveResult
  }

  visualConfig.onPublish = async (data) => {
    if (!authStore.user || !isUuid(String(data.pageId))) {
      ElMessage.warning('请先保存页面草稿')
      return
    }
    const revisionId = await pageService.publish(String(data.pageId))
    return { revisionId } as VisualPublishResult
  }

  visualConfig.onPreview = async (data) => {
    if (!authStore.user || !isUuid(String(data.pageId))) {
      ElMessage.warning('请先保存页面草稿')
      return
    }
    const token = await pageService.createPreviewToken(String(data.pageId))
    const origin = import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000'
    return { url: `${origin.replace(/\/$/, '')}/_preview/${token}` }
  }

  visualConfig.revisionProvider = {
    async list(pageId) {
      const [page, rows] = await Promise.all([
        pageService.get(String(pageId)),
        pageService.listRevisions(String(pageId)),
      ])
      return {
        currentRevisionId: page?.published_revision_id || null,
        revisions: rows.map((row) => ({
          id: row.id,
          version: row.version,
          title: row.title,
          createdAt: row.created_at,
          isCurrent: row.id === page?.published_revision_id,
        })),
      }
    },
    async rollback(pageId, revisionId) {
      await pageService.rollback(String(pageId), revisionId)
    },
  }

  visualConfig.savedPageLoader = async (id, appId) => {
    const row = await pageService.get(id as string)
    if (appId ? row?.app_id !== appId : !!row?.app_id) return null
    return row && authStore.user
      ? {
          ...row.schema,
          // `pages.id` is the source of truth. Older rows may contain an empty or stale schema.pageId.
          pageId: row.id,
          slug: row.slug,
          blocks: await businessDataService.migrateLegacyBusinessRefs(row.schema.blocks || [], authStore.user.id),
        }
      : null
  }

  visualConfig.appThemeLoader = async (appId) => {
    const app = await appService.get(appId)
    return (app?.theme_config || null) as any
  }

  visualConfig.dataSourceProvider = dataSourceService
  visualConfig.entityProvider = {
    async list(entityType, keyword = '') {
      const result =
        entityType === 'product'
          ? await productService.list({ page: 1, pageSize: 10, keyword })
          : await articleService.list({ page: 1, pageSize: 10, keyword })
      return result.items.map((item) => ({ id: item.id, title: item.title }))
    },
    async get(entityType, id) {
      const item = entityType === 'product' ? await productService.get(id) : await articleService.get(id)
      return item ? { id: item.id, title: item.title } : null
    },
  }

  visualConfig.urlPageProvider = {
    async listGlobalPages() {
      return (await pageService.list())
        .filter((page) => page.status === 'published')
        .map((page) => ({ label: page.title, value: `/p/${page.slug}` }))
    },
    async listAppPages(appId) {
      const { appService } = await import('../services/app.service')
      return (await appService.pages(appId))
        .filter((page) => page.status === 'published')
        .map((page) => ({ label: page.title, value: page.route_key || '' }))
        .filter((page) => !!page.value)
    },
  }
}
