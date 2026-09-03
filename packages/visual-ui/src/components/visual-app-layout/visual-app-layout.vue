<template>
  <div class="visual-app-layout">
    <main class="visual-app-layout__content"><slot /></main>
    <VisualTabbar
      v-if="layout.showTabbar && layout.items.length"
      :items="layout.items"
      :active-color="layout.activeColor"
      :inactive-color="layout.inactiveColor"
      :background-color="layout.backgroundColor"
      :height="layout.tabbarHeight"
      :safe-area="layout.safeArea"
      @navigate="$emit('navigate', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import VisualTabbar from '../visual-tabbar'

interface LayoutConfig {
  showTabbar: boolean
  tabbarHeight: number
  backgroundColor: string
  activeColor: string
  inactiveColor: string
  safeArea: boolean
  items: Array<{ key: string; label: string; icon?: string; routeKey: string; visible?: boolean; sort?: number }>
}

defineOptions({ name: 'VisualAppLayout' })
defineProps<{ layout: LayoutConfig }>()
defineEmits<{ navigate: [item: LayoutConfig['items'][number]] }>()
</script>

<style scoped>
.visual-app-layout { min-height: 100%; display: flex; flex-direction: column; }
.visual-app-layout__content { flex: 1; min-height: 0; }
</style>
