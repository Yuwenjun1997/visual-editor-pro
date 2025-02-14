import { computed } from 'vue'

export const useSafeArea = () => {
  const systemInfo = uni.getSystemInfoSync()

  const bottom = computed(() => {
    // #ifdef MP-WEIXIN
    return systemInfo.safeAreaInsets?.bottom || 0
    // #endif
    // #ifdef H5
    return systemInfo.windowBottom || 0
    // #endif
  })

  const top = computed(() => {
    // #ifdef MP-WEIXIN
    return systemInfo.safeAreaInsets?.top || 0
    // #endif
    // #ifdef H5
    return systemInfo.windowTop || 0
    // #endif
  })

  return {
    bottom,
    top,
  }
}
