<template>
  <div class="visual-components h-full">
    <div class="title p-2">全部组件</div>
    <el-scrollbar height="100%" class="flex-1">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基础组件" name="basic">
          <visual-component-group :list="componentModules.basicWidgets" />
        </el-collapse-item>
        <el-collapse-item title="图文组件" name="imageText">
          <visual-component-group :list="componentModules.imageTextWidgets" />
        </el-collapse-item>
        <el-collapse-item title="业务组件" name="service">
          <visual-component-group :list="componentModules.serviceWidgets" />
        </el-collapse-item>
        <el-collapse-item title="数据组件" name="data">
          <visual-component-group :list="componentModules.dataWidgets" />
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import VisualComponentGroup from './visual-component-group/visual-component-group.vue'
import { visualConfig } from '@/utils/visual.registry'

const componentModules = computed(() => visualConfig.componentModules)

const activeNames = ref<string[]>([])

const handleChange = () => {}
</script>

<style lang="scss">
.visual-components {
  display: flex;
  flex-direction: column;

  .title {
    color: var(--el-text-color-regular);
  }
}
</style>
