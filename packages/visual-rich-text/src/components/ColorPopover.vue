<template>
  <el-popover :width="220" trigger="click" placement="bottom">
    <template #reference><ToolbarButton :icon="icon" :label="label" :active="active" /></template>
    <div class="vrt-flex vrt-flex-col vrt-gap-2">
      <div class="vrt-flex vrt-items-center vrt-justify-between vrt-gap-2">
        <span>{{ label }}</span>
        <el-color-picker show-alpha :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
      </div>
      <div aria-label="预选颜色" class="vrt-flex vrt-gap-2">
        <button
          v-for="color in presets"
          :key="color"
          type="button"
          :aria-label="`选择 ${color}`"
          :style="{ backgroundColor: color }"
          :class="['vrt-color-swatch', modelValue === color && 'is-active']"
          @click="emit('update:modelValue', color)"
        />
        <button
          type="button"
          aria-label="清除颜色"
          :class="['vrt-color-swatch', 'is-empty', !modelValue && 'is-active']"
          @click="emit('update:modelValue', '')"
        >
          <Icon icon="tabler:ban" />
        </button>
      </div>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
import ToolbarButton from './ToolbarButton.vue'
import { Icon } from '@iconify/vue'
defineProps<{ label: string; icon: string; modelValue: string; active?: boolean }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: string | null): void }>()
const presets = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
</script>
