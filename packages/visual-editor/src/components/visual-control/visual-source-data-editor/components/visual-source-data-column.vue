<template>
  <div class="visual-source-data-column"></div>
</template>

<script setup lang="ts">
import type { VisualSourceOptions } from '@visual/ui/types'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
</script>

<style scoped></style>
