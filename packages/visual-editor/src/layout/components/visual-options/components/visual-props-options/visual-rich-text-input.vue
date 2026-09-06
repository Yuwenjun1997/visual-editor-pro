<template>
  <div class="visual-rich-text-input" @click.stop>
    <el-button class="ve-w-full" @click="open">编辑富文本内容</el-button>
    <el-drawer
      v-model="visible"
      append-to-body
      title="编辑富文本内容"
      destroy-on-close
      size="min(1080px, calc(100vw - 32px))"
      @closed="resetDraft"
    >
      <RichTextEditor v-model="draft" />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { RichTextEditor } from '@visual/rich-text'

const model = defineModel<string>({ default: '' })
const visible = ref(false)
const draft = ref('')

const open = () => {
  draft.value = model.value
  visible.value = true
}

const save = () => {
  model.value = draft.value
  visible.value = false
}

const resetDraft = () => {
  draft.value = ''
}
</script>
