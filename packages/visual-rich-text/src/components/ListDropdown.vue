<template>
  <el-dropdown trigger="click" @command="emit('select', $event)">
    <ToolbarButton label="列表类型" :icon="current.icon" :active="value !== 'none'" dropdown>
      <svg v-if="value === 'none'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 6h13M8 12h9M8 18h5M3 6v.01M3 12v.01M3 18v.01M3 3l18 18" />
      </svg>
    </ToolbarButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in items" :key="item.value" :command="item.value">
          <span class="vrt-dropdown-item-content">
            <svg v-if="item.value === 'none'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 6h13M8 12h9M8 18h5M3 6v.01M3 12v.01M3 18v.01M3 3l18 18" />
            </svg>
            <Icon v-else :icon="item.icon" />
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
const emit = defineEmits<{ select: [value: string] }>()
const items = [
  { value: 'none', label: '取消列表', icon: '' },
  { value: 'bulletList', label: '无序列表', icon: 'tabler:list' },
  { value: 'orderedList', label: '有序列表', icon: 'tabler:list-numbers' },
  { value: 'taskList', label: '任务列表', icon: 'tabler:list-check' },
]
const current = computed(() => items.find((item) => item.value === props.value) || items[0])
</script>
