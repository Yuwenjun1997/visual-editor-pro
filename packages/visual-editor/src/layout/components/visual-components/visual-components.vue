<template>
  <flex-full-layout class="visual-components">
    <template #header>
      <div class="title ve-p-2">全部组件</div>
      <el-input
        v-model="keyword"
        class="search-input ve-px-2"
        placeholder="搜索组件"
        clearable
      >
        <template #prefix>
          <Icon
            class="ve-text-base"
            icon="line-md:search-twotone"
          />
        </template>
      </el-input>
    </template>
    <el-scrollbar
      height="100%"
      class="ve-h-full ve-min-h-0"
    >
      <template v-if="trimmedKeyword">
        <visual-component-group
          v-if="searchList.length"
          :list="searchList"
        />
        <el-empty
          v-else
          description="未找到匹配的组件"
          :image-size="60"
        />
      </template>
      <el-collapse
        v-else
        v-model="activeNames"
        @change="handleChange"
      >
        <el-collapse-item
          title="基础组件"
          name="basic"
        >
          <visual-component-group :list="componentModules.basicWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="布局容器"
          name="layout"
        >
          <visual-component-group :list="componentModules.layoutWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="图文内容"
          name="imageText"
        >
          <visual-component-group :list="componentModules.imageTextWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="媒体组件"
          name="media"
        >
          <visual-component-group :list="componentModules.mediaWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="电商营销"
          name="commerce"
        >
          <visual-component-group :list="componentModules.commerceWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="互动服务"
          name="service"
        >
          <visual-component-group :list="componentModules.serviceWidgets" />
        </el-collapse-item>
        <el-collapse-item
          title="数据组件"
          name="data"
        >
          <visual-component-group :list="componentModules.dataWidgets" />
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </flex-full-layout>
</template>

<script setup lang="ts">
import FlexFullLayout from '../../../components/flex-full-layout/index.vue'
import VisualComponentGroup from './visual-component-group/visual-component-group.vue'
import { Icon } from '@iconify/vue'
import type { VisualEditorComponent } from '../../../types/visual-editor'
import { visualConfig } from '../../../utils/visual.registry'

const componentModules = computed(() => visualConfig.componentModules)

const keyword = ref('')

const trimmedKeyword = computed(() => keyword.value.trim())

const searchList = computed<VisualEditorComponent[]>(() => {
  const kw = trimmedKeyword.value.toLowerCase()
  if (!kw) return []
  return Object.values(componentModules.value)
    .flat()
    .filter(
      (c) =>
        c.label.toLowerCase().includes(kw) ||
        c.componentName.toLowerCase().includes(kw) ||
        c.key.toLowerCase().includes(kw),
    )
})

const activeNames = ref<string[]>(['basic'])

const handleChange = () => {}
</script>

<style lang="scss">
.visual-components {
  .title {
    color: var(--el-text-color-regular);
  }

  .search-input {
    padding-bottom: 8px;
  }
}
</style>
