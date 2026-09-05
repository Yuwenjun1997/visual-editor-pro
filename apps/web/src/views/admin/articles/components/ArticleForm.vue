<template>
  <el-form :model="form" label-width="90px">
    <el-divider content-position="left">基本信息</el-divider>
    <el-form-item label="文章标题">
      <el-input v-model="form.title" placeholder="文章标题" />
    </el-form-item>
    <el-form-item label="封面图">
      <ImageUploader v-model="form.cover_url" />
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="form.category_id" clearable placeholder="不选分类" style="width: 100%">
        <el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="作者">
      <el-input v-model="form.author_name" placeholder="作者名" />
    </el-form-item>
    <el-form-item label="发布时间">
      <el-date-picker
        v-model="form.publish_time"
        type="datetime"
        style="width: 100%"
        placeholder="选择发布时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
    <el-divider content-position="left">发布设置</el-divider>
    <el-form-item label="状态">
      <el-select v-model="form.status" style="width: 160px">
        <el-option label="草稿" value="draft" />
        <el-option label="已发布" value="published" />
      </el-select>
    </el-form-item>
    <el-form-item label="摘要">
      <el-input v-model="form.summary" :rows="2" type="textarea" />
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
  status: 'draft' | 'published'
  html: string
  author_name: string
  publish_time: string | null
  summary: string
}>({ required: true })
const uploadImage = useRichTextImageUpload()
</script>
