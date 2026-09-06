<template>
  <span class="vrt-toolbar-button-wrapper">
    <el-tooltip placement="top" :content="label">
      <button
        type="button"
        :aria-label="label"
        :disabled="disabled"
        :aria-pressed="active"
        :class="['vrt-editor-toolbar-button', active && 'is-active']"
      >
        <template v-if="icon"><Icon :icon="icon" /></template>
        <template v-else><slot /></template>
        <Icon v-if="dropdown" class="vrt-toolbar-dropdown-indicator" icon="tabler:chevron-down" />
      </button>
    </el-tooltip>
  </span>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{ label: string; icon?: string; active?: boolean; disabled?: boolean; dropdown?: boolean }>()
</script>
