import { describe, expect, it } from 'vitest'
import { createStageSelectionSync } from './stage-selection-sync'

describe('stage selection sync', () => {
  it('does not broadcast a selection that was applied from host state', () => {
    const sync = createStageSelectionSync()

    expect(sync.shouldApplySelection('block-a', '')).toBe(true)
    expect(sync.shouldBroadcastSelection('block-a')).toBe(false)
  })

  it('keeps the newest stage selection while earlier host acknowledgements arrive', () => {
    const sync = createStageSelectionSync()

    expect(sync.shouldBroadcastSelection('block-a')).toBe(true)
    expect(sync.shouldBroadcastSelection('block-b')).toBe(true)
    expect(sync.shouldApplySelection('block-a', 'block-b')).toBe(false)
    expect(sync.shouldApplySelection('block-b', 'block-b')).toBe(false)
  })

  it('rejects an out-of-date host state revision', () => {
    const sync = createStageSelectionSync()

    expect(sync.shouldApplyState(3)).toBe(true)
    expect(sync.shouldApplyState(2)).toBe(false)
    expect(sync.shouldApplyState(3)).toBe(true)
  })
})
