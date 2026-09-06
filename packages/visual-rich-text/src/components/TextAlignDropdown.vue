<template>
  <el-dropdown trigger="click" @command="emit('select', $event)">
    <ToolbarButton label="文本对齐" :icon="current.icon" :active="value !== 'left'" dropdown />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in items" :key="item.value" :command="item.value">
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
const props = defineProps<{ value: string }>()
const emit = defineEmits<{ select: [value: 'left' | 'center' | 'right' | 'justify'] }>()
const items = [
  { value: 'left', label: '左对齐', icon: 'tabler:align-left' },
  { value: 'center', label: '居中', icon: 'tabler:align-center' },
  { value: 'right', label: '右对齐', icon: 'tabler:align-right' },
  { value: 'justify', label: '两端对齐', icon: 'tabler:align-justified' },
] as const
const current = computed(() => items.find((item) => item.value === props.value) || items[0])
</script>
