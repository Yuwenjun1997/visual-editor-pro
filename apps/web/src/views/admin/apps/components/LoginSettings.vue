<template>
  <div class="wa-grid wa-gap-2 xl:wa-grid-cols-[minmax(0,1fr)_400px]">
    <div class="wa-min-w-0 wa-space-y-2">
      <el-card>
        <el-form label-width="110px">
          <el-form-item label="布局方案">
            <el-select v-model="model.layout">
              <el-option value="card" label="居中品牌卡片" />
              <el-option value="brand" label="顶部品牌区＋底部表单" />
              <el-option label="全屏背景＋浮层表单" value="background" />
            </el-select>
          </el-form-item>
          <el-form-item label="Logo"><ImageUploader v-model="model.logo" /></el-form-item>
          <el-form-item label="标题"><el-input v-model="model.title" maxlength="60" /></el-form-item>
          <el-form-item label="副标题"><el-input v-model="model.subtitle" maxlength="160" /></el-form-item>
          <el-form-item label="背景图片"><ImageUploader v-model="model.backgroundImage" /></el-form-item>
          <el-form-item label="背景颜色"><el-color-picker v-model="model.backgroundColor" /></el-form-item>
          <el-form-item label="主色"><el-color-picker v-model="model.primaryColor" /></el-form-item>
          <el-form-item label="表单圆角"><el-slider v-model="model.radius" :min="0" :max="40" /></el-form-item>
          <el-form-item label="按钮文案"><el-input v-model="model.buttonText" maxlength="30" /></el-form-item>
          <el-form-item label="协议名称"><el-input v-model="model.agreementName" /></el-form-item>
          <el-form-item label="协议链接">
            <el-input v-model="model.agreementUrl" placeholder="https://..." />
          </el-form-item>
          <el-form-item label="必须同意协议"><el-switch v-model="model.requireAgreement" /></el-form-item>
        </el-form>
      </el-card>
      <slot></slot>
    </div>
    <el-card class="xl:wa-sticky">
      <template #header>
        <div>
          <div class="wa-text-base wa-font-medium">实时预览</div>
          <div class="wa-mt-1 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
            预览尺寸与基础配置一致，按 H5 移动端比例展示。
          </div>
        </div>
      </template>
      <div class="wa-flex wa-justify-center wa-py-2">
        <PreviewPhoneFrame screen-class="login-preview-screen">
          <VisualLoginPanel preview :config="model" />
        </PreviewPhoneFrame>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import type { AppLoginConfig } from '@visual/ui/types'
import { VisualLoginPanel } from '@visual/ui'
import ImageUploader from '../../../../components/ImageUploader.vue'
import PreviewPhoneFrame from '../../../../components/PreviewPhoneFrame.vue'
const model = defineModel<AppLoginConfig>({ required: true })
</script>

<style scoped>
.login-preview-screen :deep(.v-login) {
  min-height: 500px;
}
</style>
