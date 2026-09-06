<template>
  <el-popover v-model:visible="visible" :width="300" trigger="click" placement="bottom" @show="emit('open')">
    <template #reference><ToolbarButton label="链接" :active="active" icon="tabler:link" /></template>
    <div class="vrt-flex vrt-flex-col vrt-gap-2">
      <el-input v-model="url" clearable placeholder="https://example.com" />
      <div class="vrt-flex vrt-justify-end vrt-gap-2">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="active" @click="remove">移除</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import ToolbarButton from './ToolbarButton.vue'
const props = defineProps<{ active?: boolean; initialUrl: string }>()
const emit = defineEmits<{ open: []; save: [url: string]; remove: [] }>()
const visible = ref(false)
const url = ref(props.initialUrl)
watch(
  () => props.initialUrl,
  (value) => {
    url.value = value
  },
)
const save = () => {
  emit('save', url.value)
  visible.value = false
}
const remove = () => {
  emit('remove')
  visible.value = false
}
</script>
