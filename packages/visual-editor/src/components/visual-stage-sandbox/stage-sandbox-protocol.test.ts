import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { cloneStageMessage, createStageMessage, isStageMessage, STAGE_CHANNEL, STAGE_PROTOCOL_VERSION } from './stage-sandbox-protocol'

describe('stage sandbox protocol', () => {
  it('clones reactive payloads before they cross the iframe boundary', () => {
    const message = createStageMessage('stage-state-sync', 'editor', {
      blocks: reactive([{ _vid: 'block-1', props: reactive({ title: '标题' }) }]) as any,
      pageConfig: reactive({ globalStyle: reactive({ backgroundColor: '#fff' }) }),
      device: 'pc',
      activePanel: 'design',
      selectedVid: 'block-1',
      themeMode: 'light',
    })

    const cloned = cloneStageMessage(message)

    expect(cloned).toEqual(message)
    expect(cloned.payload.blocks).not.toBe(message.payload.blocks)
    expect(cloned.payload.pageConfig).not.toBe(message.payload.pageConfig)
  })
})

it('marks only complete protocol envelopes as stage messages', () => {
  const message = createStageMessage('stage-ready', 'editor', {})

  expect(isStageMessage(message)).toBe(true)
  expect(message.channel).toBe(STAGE_CHANNEL)
  expect(message.protocolVersion).toBe(STAGE_PROTOCOL_VERSION)
  expect(isStageMessage({ ...message, messageId: undefined })).toBe(false)
})
