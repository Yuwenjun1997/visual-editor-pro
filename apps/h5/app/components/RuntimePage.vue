<template>
  <main :style="pageStyle" class="runtime-page">
    <VisualPageRenderer :blocks="page.schema.blocks" />
  </main>
</template>

<script setup lang="ts">
import { mountThemeToRoot } from '@visual/ui/hooks/useMountThemeToRoot'
import type { RuntimePage } from '../types/runtime'
import { APP_TEXT_COLOR_KEY } from '../app-context'

const props = defineProps<{ page: RuntimePage }>()
const pageStyle = computed(() => props.page.schema.globalStyle || {})
const appTextColor = inject(
  APP_TEXT_COLOR_KEY,
  computed(() => undefined),
)
const pageTextColor = computed(() => pageStyle.value.color || appTextColor.value)

const stopThemeMount = mountThemeToRoot({
  textColor: () => pageTextColor.value,
})

onBeforeUnmount(stopThemeMount)

</script>

<style scoped>
.runtime-page {
  min-height: 100%;
}
</style>
