import { describe, expect, it } from 'vitest'
import { HistoryStack } from './history-stack'

const entry = (value: string) => ({ value, fingerprint: value, time: 0 })

describe('HistoryStack', () => {
  it('initializes and navigates snapshots', () => {
    const history = new HistoryStack<string>()
    history.initialize(entry('a'))
    history.commit(entry('b'))
    expect(history.canUndo).toBe(true)
    expect(history.undo()?.value).toBe('a')
    expect(history.redo()?.value).toBe('b')
  })

  it('deduplicates and truncates redo after branching', () => {
    const history = new HistoryStack<string>()
    history.initialize(entry('a'))
    expect(history.commit(entry('a'))).toBe(false)
    history.commit(entry('b'))
    history.undo()
    history.commit(entry('c'))
    expect(history.canRedo).toBe(false)
    expect(history.current?.value).toBe('c')
  })

  it('keeps the newest entries within the configured limit', () => {
    const history = new HistoryStack<string>(2)
    history.initialize(entry('a'))
    history.commit(entry('b'))
    history.commit(entry('c'))
    expect(history.undo()?.value).toBe('b')
    expect(history.undo()).toBeUndefined()
  })
})
