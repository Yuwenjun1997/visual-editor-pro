<template>
  <div>
    <div class="wa-mb-5 wa-flex wa-flex-col wa-gap-4 sm:wa-flex-row sm:wa-items-start sm:wa-justify-between">
      <div>
        <h1 class="wa-text-2xl wa-font-semibold wa-text-[var(--el-text-color-primary)]">工作台</h1>
        <p class="wa-mt-2 wa-text-sm wa-text-[var(--el-text-color-secondary)]">概览当前账号下的内容数据</p>
      </div>
      <el-button :loading="loading" @click="load">刷新数据</el-button>
    </div>

    <div
      v-loading="loading"
      class="wa-grid wa-min-h-[110px] wa-grid-cols-1 wa-gap-4 sm:wa-grid-cols-2 xl:wa-grid-cols-4"
    >
      <el-card v-for="item in statItems" :key="item.key" shadow="never">
        <div class="wa-flex wa-items-center wa-gap-4 wa-p-1">
          <div
            :class="item.iconClass"
            class="wa-flex wa-h-12 wa-w-12 wa-shrink-0 wa-items-center wa-justify-center wa-rounded-xl wa-text-[22px]"
          >
            <Icon :icon="item.icon" />
          </div>
          <div>
            <div class="wa-text-sm wa-text-[var(--el-text-color-secondary)]">{{ item.label }}</div>
            <div
              class="wa-mt-1.5 wa-text-[28px] wa-font-semibold wa-leading-none wa-text-[var(--el-text-color-primary)]"
            >
              {{ stats[item.key] }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDashboardPage } from './composables/useDashboardPage'
const { stats, loading, statItems, load } = useDashboardPage()
</script>
