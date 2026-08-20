<template>
  <div class="visual-icon-picker">
    <el-popover
      trigger="click"
      popper-class="visual-icon-picker__popover"
      width="300px"
      v-model:visible="visible"
    >
      <template #reference>
        <el-button size="small">
          <div class="icon-btn" :class="{ 'is-empty': isEmpty }">
            <Icon :icon="showIcon" />
          </div>
        </el-button>
      </template>

      <div v-if="visible">
        <div class="flex items-center gap-1">
          <el-input v-model="keyword" size="small" placeholder="图标名称搜索" />
          <el-button type="primary" @click="onSearch()" size="small">
            <template #icon>
              <Icon icon="line-md:search-twotone" />
            </template>
            <span class="text-xs whitespace-nowrap">搜索</span>
          </el-button>
        </div>

        <div class="icon-list my-2">
          <div
            v-for="(item, index) in icons"
            :key="index"
            class="icon-item"
            @click="handleClick(item)"
          >
            <Icon :icon="item" />
          </div>
        </div>

        <div class="flex items-start justify-center">
          <el-pagination
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="iconTotal"
            small
            @current-change="onCurrentChange"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useVModel } from '@vueuse/core'
import { useIconList } from './configs/index'

interface Props {
  modelValue?: string
}

defineOptions({
  name: 'VisualIconPicker',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { icons, pageSize, iconTotal, keyword, onSearch, onCurrentChange } =
  useIconList()

const modelValue = useVModel(props, 'modelValue', emit)

const isEmpty = computed(() => !modelValue.value)

const showIcon = computed(() => (isEmpty.value ? 'bi:x-lg' : modelValue.value))

const visible = ref(false)

const handleClick = (icon: string) => {
  modelValue.value = icon
  visible.value = false
}
</script>

<style lang="scss">
.visual-icon-picker {
  .el-button {
    padding: 2px;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 18px;

    &.is-empty {
      font-size: 12px;
      color: var(--v-text-color-placeholder);
    }
  }
}

.visual-icon-picker__popover {
  .icon-list {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--el-color-info-light-7);
    gap: 1px;
    border: 1px solid var(--el-color-info-light-7);

    .icon-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 36px;
      outline-offset: -2px;
      cursor: pointer;
      font-size: 40px;
      background-color: var(--el-bg-color);

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
}
</style>
