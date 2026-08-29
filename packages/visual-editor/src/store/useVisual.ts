import type {
  VisualBlockData,
  VisualBlockSlots,
  VisualEditorComponent,
} from '../types/visual-editor'
import {
  createVisualBlock,
  createVisualEditorComponent,
  isSameBlock,
} from '../utils/visual.utils'
import { defineStore } from 'pinia'

interface VisualState {
  activePanel: string
  isDrag: boolean
  device: 'h5' | 'pad' | 'pc'
  vid: string
  currentBlock: VisualBlockData | null
  visualEditorComponent: VisualEditorComponent | null
  moveBlock: VisualBlockData | null
}

export const useViusalStore = defineStore('visual', {
  state: (): VisualState => ({
    activePanel: 'design',
    isDrag: false,
    device: 'h5',
    vid: '',
    currentBlock: null,
    visualEditorComponent: null,
    moveBlock: null,
  }),

  actions: {
    setMoveBlock(block: VisualBlockData) {
      this.moveBlock = block
    },
    setCurrentBlock(block: VisualBlockData) {
      if (this.vid === block._vid) return
      this.vid = block._vid
      this.currentBlock = block
      this.visualEditorComponent = createVisualEditorComponent(block)
    },
    setDevice(device: 'h5' | 'pad' | 'pc') {
      this.device = device
    },
    updateCurrentBlock() {
      if (!this.currentBlock) return
      if (!this.visualEditorComponent) return
      const newBlock = createVisualBlock(this.visualEditorComponent)
      if (isSameBlock(this.currentBlock, newBlock)) return
      this.currentBlock.listData = newBlock.listData
      this.currentBlock.props = newBlock.props

      // 同步动态 slots（仅 visual-tabs）
      if (this.currentBlock.key === 'VisualTabs') {
        const listData = newBlock.listData
        if (listData && listData.length > 0) {
          const newSlots: VisualBlockSlots = {}
          listData.forEach((_: any, index: number) => {
            const key = `tab-${index}`
            newSlots[key] = this.currentBlock?.slots?.[key] || {
              name: `页签${index + 1}`,
              blocks: [],
            }
          })
          this.currentBlock.slots = newSlots
        }
      }
    },
    clearCurrent() {
      this.vid = ''
      this.currentBlock = null
      this.visualEditorComponent = null
    },
    clearMoveBlock() {
      this.moveBlock = null
    },
  },
})
