<template>
  <el-dialog
    v-model="visible"
    append-to-body
    title="从图片库选择"
    destroy-on-close
    width="min(1100px, calc(100vw - 32px))"
    @closed="cancel"
  >
    <ImageLibraryManager v-if="visible && userId" selectable :client="client" :user-id="userId" @select="select" />
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import ImageLibraryManager from './ImageLibraryManager.vue'
import type { ImageAssetWithUrl } from '../types'
defineProps<{ client: SupabaseClient; userId: string }>()
const visible = ref(false)
let resolveSelection: ((value: string | null) => void) | undefined
const open = () =>
  new Promise<string | null>((resolve) => {
    resolveSelection = resolve
    visible.value = true
  })
const select = (asset: ImageAssetWithUrl) => {
  visible.value = false
  resolveSelection?.(asset.url)
  resolveSelection = undefined
}
const cancel = () => {
  resolveSelection?.(null)
  resolveSelection = undefined
}
defineExpose({ open })
</script>
