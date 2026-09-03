import type { LocalDraftRecord, LocalDraftStorage } from '../types/visual-editor'

const memoryDrafts = new Map<string, LocalDraftRecord>()

const getLocalStorage = (): Storage | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export const createLocalDraftStorage = (): LocalDraftStorage => ({
  load(key) {
    const storage = getLocalStorage()
    try {
      const raw = storage?.getItem(key)
      if (raw) return JSON.parse(raw) as LocalDraftRecord
    } catch {
      // Fall through to the in-memory fallback.
    }
    return memoryDrafts.get(key) || null
  },
  save(key, record) {
    const storage = getLocalStorage()
    try {
      if (storage) {
        storage.setItem(key, JSON.stringify(record))
        memoryDrafts.delete(key)
        return true
      }
    } catch {
      // Fall through to the in-memory fallback.
    }
    memoryDrafts.set(key, record)
    return false
  },
  remove(key) {
    memoryDrafts.delete(key)
    try {
      getLocalStorage()?.removeItem(key)
    } catch {
      // Ignore storage cleanup failures.
    }
  },
  has(key) {
    return !!this.load(key)
  },
})
