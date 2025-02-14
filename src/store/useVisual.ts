import type {
  VisualBlockData,
  VisualEditorComponent,
} from '@/types/visual-editor'
import {
  createVisualBlock,
  createVisualEditorComponent,
  isSameBlock,
} from '@/utils/visual.utils'
import { defineStore } from 'pinia'

interface VisualState {
  activePanel: string
  isDrag: boolean
  device: 'h5' | 'pad'
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
    setDevice(device: 'h5' | 'pad') {
      this.device = device
    },
    updateCurrentBlock() {
      if (!this.currentBlock) return
      if (!this.visualEditorComponent) return
      const newBlock = createVisualBlock(this.visualEditorComponent)
      if (isSameBlock(this.currentBlock, newBlock)) return
      this.currentBlock.listData = newBlock.listData
      this.currentBlock.props = newBlock.props
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
