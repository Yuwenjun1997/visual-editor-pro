<template>
  <div class="visual-source-data-request">
    <div class="flex items-center gap-1">
      <el-select
        class="w-40"
        v-model="modelValue.httpMethod"
        placeholder="请求方式"
      >
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
      </el-select>
      <el-input placeholder="请求地址" v-model="modelValue.httpRequest" />
      <el-button type="primary" class="w-40" @click="sendResuest">
        测试请求
      </el-button>
    </div>
    <el-radio-group size="small" v-model="optionType">
      <el-radio-button label="请求参数" value="requestParams" />
      <el-radio-button label="请求头信息" value="requestHeaders" />
      <el-radio-button label="响应数据映射信息" value="responseTransform" />
    </el-radio-group>
    <template v-if="optionType === 'requestParams'">
      <visual-request-params v-model="modelValue" />
    </template>
    <template v-if="optionType === 'requestHeaders'">
      <visual-request-headers v-model="modelValue" />
    </template>
    <template v-if="optionType === 'responseTransform'">
      <visual-request-format v-model="modelValue" />
    </template>
  </div>
</template>

<script setup lang="ts">
import VisualRequestParams from './components/visual-request-params.vue'
import VisualRequestHeaders from './components/visual-request-headers.vue'
import VisualRequestFormat from './components/visual-request-format.vue'
import { useVModel } from '@vueuse/core'
import { useVisualRequest } from '@/uni_modules/visual-components/hooks/useVisualRequest'
import { ElNotification } from 'element-plus'
import type { VisualSourceOptions } from '@/uni_modules/visual-components/types'

interface Props {
  modelValue: VisualSourceOptions
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VisualSourceOptions): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const optionType = ref<string>('requestParams')

const sendResuest = async () => {
  try {
    const { request } = useVisualRequest(modelValue.value)
    const response = await request()
    console.log('===============响应信息===============')
    console.log(JSON.stringify(response, null, 2))
    ElNotification.success({
      title: '请求成功',
      message: '可在浏览器控制台查看响应信息',
    })
  } catch (error: any) {
    console.log('===============错误信息===============')
    console.log(JSON.stringify(error, null, 2))
    ElNotification.error({
      title: '请求失败',
      message: '可在浏览器控制台查看错误信息',
    })
  }
}
</script>

<style lang="scss" scoped>
.visual-source-data-request {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
