<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<script setup lang="ts">
import { provideH5Runtime } from '@visual/ui'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

defineOptions({ name: 'EditorShell' })
provideH5Runtime({
  editor: true,
  $navigateTo() {},
  async $request() {
    throw new Error('编辑模式不发送请求')
  },
  $emit() {},
})
</script>
