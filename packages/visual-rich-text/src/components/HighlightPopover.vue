<template>
  <ColorPopover
    label="高亮颜色"
    :active="active"
    icon="tabler:highlight"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
<script setup lang="ts">
import ColorPopover from './ColorPopover.vue'
defineProps<{ modelValue: string; active?: boolean }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: string | null): void }>()
</script>
