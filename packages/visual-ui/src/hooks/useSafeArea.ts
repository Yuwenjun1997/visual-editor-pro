import { computed } from 'vue'

export const useSafeArea = () => {
  const bottom = computed(() => {
    return 0
  })

  const top = computed(() => {
    return 0
  })

  return {
    bottom,
    top,
  }
}
