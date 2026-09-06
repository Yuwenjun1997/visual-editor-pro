<template>
  <el-dropdown trigger="click" @command="emit('select', $event)">
    <ToolbarButton dropdown label="内容宽度" :icon="current.icon" :active="value !== 'ipad'" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
          <span class="vrt-dropdown-item-content">
            <Icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolbarButton from './ToolbarButton.vue'
export type ContentWidth = 'pc' | 'ipad' | 'h5'
const props = defineProps<{ value: ContentWidth }>()
const emit = defineEmits<{ select: [value: ContentWidth] }>()
const options = [
  { value: 'pc', label: 'PC 宽度', icon: 'tabler:device-desktop' },
  { value: 'ipad', label: 'iPad 宽度', icon: 'tabler:device-tablet' },
  { value: 'h5', label: 'H5 宽度', icon: 'tabler:device-mobile' },
] as const
const current = computed(() => options.find((item) => item.value === props.value) || options[0])
</script>
