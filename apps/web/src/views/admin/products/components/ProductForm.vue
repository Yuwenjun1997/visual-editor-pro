<template>
  <el-form :model="form" label-width="90px">
    <el-divider content-position="left">基本信息</el-divider>
    <el-form-item label="商品标题">
      <el-input v-model="form.title" placeholder="商品名称" />
    </el-form-item>
    <el-form-item label="封面图">
      <ImageUploader v-model="form.cover_url" />
    </el-form-item>
    <el-form-item label="售价">
      <el-input-number v-model="form.price" :min="0" :precision="2" :controls="false" style="width: 180px" />
    </el-form-item>
    <el-form-item label="原价">
      <el-input-number v-model="form.origin_price" :min="0" :precision="2" :controls="false" style="width: 180px" />
    </el-form-item>
    <el-form-item label="角标文案">
      <el-input v-model="form.tag" placeholder="如:新品 / 热卖" />
    </el-form-item>
    <el-form-item label="跳转链接">
      <el-input v-model="form.buy_link" placeholder="https://..." />
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="form.category_id" clearable placeholder="不选分类" style="width: 100%">
        <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
      </el-select>
    </el-form-item>
    <el-divider content-position="left">发布设置</el-divider>
    <el-form-item label="状态">
      <el-select v-model="form.status" style="width: 160px">
        <el-option label="已上架" value="published" />
        <el-option label="草稿" value="draft" />
        <el-option label="下架" value="off" />
      </el-select>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number v-model="form.sort" :min="0" :controls="false" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="form.description" :rows="3" type="textarea" />
    </el-form-item>
    <el-divider content-position="left">详情内容</el-divider>
    <el-form-item label="富文本详情">
      <RichTextEditor v-model="form.html" :upload-image="uploadImage" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import ImageUploader from '../../../../components/ImageUploader.vue'
import { RichTextEditor } from '@visual/rich-text'
import type { CategoryRow } from '../../../../types/api'
import { useRichTextImageUpload } from '../../../../composables/useRichTextImageUpload'
defineProps<{ categories: CategoryRow[] }>()
const form = defineModel<{
  title: string
  cover_url: string
  category_id: string | null
  status: 'draft' | 'published' | 'off'
  html: string
  price: number | null
  origin_price: number | null
  tag: string
  buy_link: string
  sort: number
  description: string
}>({ required: true })
const uploadImage = useRichTextImageUpload()
</script>
