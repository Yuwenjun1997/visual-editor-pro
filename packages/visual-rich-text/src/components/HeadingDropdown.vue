<template>
  <el-dropdown trigger="click" @command="emit('select', $event)">
    <ToolbarButton dropdown label="标题级别" :icon="current.icon" :active="value !== 'paragraph'" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="paragraph">
          <span class="vrt-dropdown-item-content">
            <Icon icon="tabler:pilcrow" />
            <span>正文</span>
          </span>
        </el-dropdown-item>
        <el-dropdown-item v-for="level in 6" :key="level" :command="`h${level}`">
          <span class="vrt-dropdown-item-content">
            <Icon :icon="`tabler:h-${level}`" />
            <span>标题 {{ level }}</span>
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
const options = [
  { value: 'paragraph', icon: 'tabler:pilcrow' },
  ...Array.from({ length: 6 }, (_, index) => ({ value: `h${index + 1}`, icon: `tabler:h-${index + 1}` })),
]
const current = computed(() => options.find((item) => item.value === props.value) || options[0])
</script>
