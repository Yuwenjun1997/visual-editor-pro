import type { Ref } from 'vue'
import type {
  LocalDraftRecord,
  LocalDraftStorage,
  PageSchema,
  VisualBlockData,
  VisualSaveStatus,
} from '../types/visual-editor'
import { createLocalDraftStorage } from '../utils/local-draft'
import { getPageSchemaFingerprint, normalizePageSchema } from '../utils/visual.utils'

export const autoSaveStatus = ref<VisualSaveStatus>('synced')
export const autoSavePaused = ref(false)
export const autoSaveDraftKey = ref('')

export interface AutoSavePayload {
  pageConfig: Ref<{ pageId: string | number; title: string; slug?: string; globalStyle: any; themeName: string }>
  blockList: Ref<VisualBlockData[]>
  namespace?: string
  storage?: LocalDraftStorage
}

export interface AutoSaveController {
  schedule: () => void
  stop: () => void
  getSchema: () => PageSchema
  getKey: (pageId?: string | number) => string
  loadDraft: (pageId?: string | number) => LocalDraftRecord | null
  saveLocal: () => boolean
  setHydrated: (schema: PageSchema, options?: { locallySaved?: boolean; syncedSchema?: PageSchema }) => void
  markSynced: (schema: PageSchema, options?: { keepDraft?: boolean }) => void
  discardDraft: () => void
  clearDraft: () => void
  needsSync: () => boolean
}

let activeController: AutoSaveController | null = null

export const getAutoSaveController = () => activeController

export const useAutoSave = (payload: AutoSavePayload) => {
  const storage = payload.storage || createLocalDraftStorage()
  const namespace = payload.namespace || (typeof window !== 'undefined' ? window.location.origin : 'visual-editor')
  let timer: ReturnType<typeof setTimeout> | undefined
  let hydrated = false
  let lastSyncedFingerprint = ''
  let lastLocalFingerprint = ''
  let activeKey = ''
  let previousKey = ''

  const getSchema = (): PageSchema => ({ ...payload.pageConfig.value, blocks: payload.blockList.value })
  const getKey = (pageId = payload.pageConfig.value.pageId) =>
    `visual-editor:draft:${namespace}:${pageId || 'new-page'}`

  const setKey = () => {
    const nextKey = getKey()
    if (activeKey && activeKey !== nextKey) previousKey = activeKey
    activeKey = nextKey
    autoSaveDraftKey.value = nextKey
    return autoSaveDraftKey.value
  }

  const setHydrated = (schema: PageSchema, options: { locallySaved?: boolean; syncedSchema?: PageSchema } = {}) => {
    hydrated = true
    lastSyncedFingerprint = getPageSchemaFingerprint(options.syncedSchema || schema)
    lastLocalFingerprint = options.locallySaved ? getPageSchemaFingerprint(schema) : ''
    autoSaveStatus.value = options.locallySaved ? 'locally-saved' : 'synced'
    setKey()
  }

  const loadDraft = (pageId?: string | number): LocalDraftRecord | null => storage.load(getKey(pageId))

  const saveLocal = () => {
    if (!hydrated || autoSavePaused.value) return false
    const schema = getSchema()
    const fingerprint = getPageSchemaFingerprint(schema)
    if (fingerprint === lastLocalFingerprint || fingerprint === lastSyncedFingerprint) return false
    const key = setKey()
    const record: LocalDraftRecord = {
      schema: normalizePageSchema(schema) as PageSchema,
      savedAt: new Date().toISOString(),
      fingerprint,
    }
    storage.save(key, record)
    lastLocalFingerprint = fingerprint
    autoSaveStatus.value = 'locally-saved'
    return true
  }

  const schedule = () => {
    if (!hydrated || autoSavePaused.value) return
    const fingerprint = getPageSchemaFingerprint(getSchema())
    if (fingerprint === lastSyncedFingerprint) {
      autoSaveStatus.value = 'synced'
      return
    }
    if (fingerprint === lastLocalFingerprint) {
      autoSaveStatus.value = 'locally-saved'
      return
    }
    if (timer) clearTimeout(timer)
    autoSaveStatus.value = 'dirty'
    timer = setTimeout(saveLocal, 3000)
  }

  const markSynced = (schema: PageSchema, options: { keepDraft?: boolean } = {}) => {
    const fingerprint = getPageSchemaFingerprint(schema)
    lastSyncedFingerprint = fingerprint
    lastLocalFingerprint = options.keepDraft ? fingerprint : ''
    setKey()
    if (options.keepDraft) {
      if (previousKey) storage.remove(previousKey)
      storage.save(autoSaveDraftKey.value, {
        schema: normalizePageSchema(schema) as PageSchema,
        savedAt: new Date().toISOString(),
        fingerprint,
      })
    } else {
      if (previousKey) storage.remove(previousKey)
      storage.remove(autoSaveDraftKey.value)
    }
    autoSaveStatus.value = 'synced'
  }

  const clearDraft = () => {
    storage.remove(setKey())
    if (previousKey) storage.remove(previousKey)
    previousKey = ''
  }

  const needsSync = () => {
    const schema = getSchema()
    return !payload.pageConfig.value.pageId || getPageSchemaFingerprint(schema) !== lastSyncedFingerprint
  }

  const discardDraft = () => {
    storage.remove(setKey())
    lastLocalFingerprint = ''
    autoSaveStatus.value = 'synced'
  }

  const stop = () => {
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  const controller: AutoSaveController = {
    schedule,
    stop,
    getSchema,
    getKey,
    loadDraft,
    saveLocal,
    setHydrated,
    markSynced,
    discardDraft,
    clearDraft,
    needsSync,
  }
  activeController = controller
  return controller
}
