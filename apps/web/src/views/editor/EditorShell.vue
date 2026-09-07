<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { provideH5Runtime } from '@visual/ui'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { articleService } from '@/services/article.service'
import { productService } from '@/services/product.service'

defineOptions({ name: 'EditorShell' })
provideH5Runtime({
  editor: true,
  auth: ref({ status: 'authenticated', profile: { id: 'preview', full_name: '预览用户', role: 'viewer' } }),
  async $detail(kind, id) {
    const item = kind === 'product' ? await productService.get(id) : await articleService.get(id)
    if (!item) throw new Error('内容不存在')
    return item
  },
  $navigateTo() {},
  async $request() {
    throw new Error('编辑模式不发送请求')
  },
  $emit() {},
})
</script>
