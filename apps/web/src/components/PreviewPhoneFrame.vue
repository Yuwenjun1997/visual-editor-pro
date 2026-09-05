<template>
  <div
    class="preview-phone-frame wa-w-[375px] wa-overflow-hidden wa-rounded-[28px] wa-border-[7px] wa-border-slate-800 wa-bg-white wa-shadow-xl"
  >
    <div class="wa-flex wa-h-7 wa-items-center wa-justify-center wa-bg-slate-800">
      <div class="wa-h-1.5 wa-w-16 wa-rounded-full wa-bg-slate-600" />
    </div>
    <div :class="screenClass" :style="screenStyle" class="preview-phone-frame__screen wa-h-[667px] wa-overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

withDefaults(
  defineProps<{
    screenClass?: string | string[] | Record<string, boolean>
    screenStyle?: CSSProperties
  }>(),
  {
    screenClass: undefined,
    screenStyle: undefined,
  },
)
</script>

<style scoped>
.preview-phone-frame__screen {
  scrollbar-width: thin;
  scrollbar-color: rgb(148 163 184 / 0.7) transparent;
}
</style>
