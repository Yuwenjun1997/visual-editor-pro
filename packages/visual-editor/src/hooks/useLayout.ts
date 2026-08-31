import { useCssVar } from '@vueuse/core'
import layoutConfig from '../configs/layout.config'

export const useLayout = () => {
  const windowRight = useCssVar('--window-right', document.documentElement)
  const windowLeft = useCssVar('--window-left', document.documentElement)

  windowRight.value = layoutConfig.windowRightWidth
  windowLeft.value = layoutConfig.windowLeftWidth

  const toggleRight = (show: boolean) => {
    windowRight.value = show ? layoutConfig.windowRightWidth : '0'
  }

  const toggleLeft = (show: boolean) => {
    windowLeft.value = show ? layoutConfig.windowLeftWidth : '0'
  }

  return {
    toggleRight,
    toggleLeft,
  }
}
