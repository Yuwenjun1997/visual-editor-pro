<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <ImageLibraryPicker ref="picker" :client="supabase" :user-id="auth.user?.id || ''" />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ImageLibraryPicker } from '@visual/image-library'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/auth'
import { registerImageLibraryPicker } from './composables/image-library-picker'
const auth = useAuthStore()
const picker = ref<InstanceType<typeof ImageLibraryPicker>>()
watch(picker, registerImageLibraryPicker, { immediate: true })
</script>

<style scoped></style>
