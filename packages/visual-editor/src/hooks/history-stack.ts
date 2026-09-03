export interface HistoryEntry<T> {
  time: number
  value: T
  fingerprint: string
}

export class HistoryStack<T> {
  private entries: HistoryEntry<T>[] = []
  private pointer = -1

  constructor(private readonly maxSize = 100) {}

  get canUndo() { return this.pointer > 0 }
  get canRedo() { return this.pointer >= 0 && this.pointer < this.entries.length - 1 }
  get current() { return this.pointer >= 0 ? this.entries[this.pointer] : undefined }

  initialize(entry: HistoryEntry<T>) {
    this.entries = [entry]
    this.pointer = 0
  }

  clear() {
    this.entries = []
    this.pointer = -1
  }

  commit(entry: HistoryEntry<T>) {
    if (this.current?.fingerprint === entry.fingerprint) return false
    this.entries.splice(this.pointer + 1)
    this.entries.push(entry)
    if (this.entries.length > this.maxSize) this.entries.shift()
    this.pointer = this.entries.length - 1
    return true
  }

  undo() {
    if (!this.canUndo) return undefined
    this.pointer--
    return this.current
  }

  redo() {
    if (!this.canRedo) return undefined
    this.pointer++
    return this.current
  }
}
