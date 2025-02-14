<template>
  <view class="visual-list-data-options">
    <template v-for="(option, index) in visualOptions">
      <visual-collapse :title="`第${index + 1}项`">
        <template #right>
          <view
            @click.stop="handleRemove(index)"
            class="visual-del-btn"
            v-if="delAble"
          >
            <Icon icon="bi:trash" />
          </view>
        </template>
        <view class="visual-list-item-options">
          <visual-control-item
            v-for="(item, propName) in option"
            :key="propName"
            :title="item.label"
          >
            <template v-if="item.type === VisualEditorType.pxInput">
              <visual-px-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.numberInput">
              <visual-number-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.normalSelect">
              <visual-normal-select
                v-model="item.defaultValue"
                :options="item.options"
              />
            </template>
            <template v-else-if="item.type === VisualEditorType.imageInput">
              <visual-image-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.colorInput">
              <visual-color-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.iconInput">
              <visual-icon-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.textInput">
              <visual-text-input v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.switch">
              <el-switch v-model="item.defaultValue" />
            </template>
            <template v-else-if="item.type === VisualEditorType.formItem">
              <visual-form-props-control
                v-if="visualKey"
                v-model="item.defaultValue"
                :visualKey="visualKey"
              />
            </template>
          </visual-control-item>
        </view>
      </visual-collapse>
    </template>
    <view class="p-1" v-if="addAble">
      <el-button size="small" class="w-full" @click="handleAdd">
        +添加项目
      </el-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '@/components/visual-collapse/visual-collapse.vue'
import VisualControlItem from '@/components/visual-control-item/visual-control-item.vue'
import VisualPxInput from '@/components/visual-control/visual-px-input/visual-px-input.vue'
import VisualNumberInput from '@/components/visual-control/visual-number-input/visual-number-input.vue'
import VisualNormalSelect from '@/components/visual-control/visual-normal-select/visual-normal-select.vue'
import VisualImageInput from '@/components/visual-control/visual-image-input/visual-image-input.vue'
import VisualColorInput from '@/components/visual-control/visual-color-input/visual-color-input.vue'
import VisualIconInput from '@/components/visual-control/visual-icon-input/visual-icon-input.vue'
import VisualTextInput from '@/components/visual-control/visual-text-input/visual-text-input.vue'
import VisualFormPropsControl from '@/components/visual-control/visual-form-props-editor/visual-form-props-control.vue'
import {
  VisualEditorType,
  type VisualEditorListData,
} from '@/types/visual-editor'
import { useViusalStore } from '@/store/useVisual'

const visualStore = useViusalStore()
const visualOptions = computed(
  () => visualStore.visualEditorComponent?.listData?.data
)

const visualKey = computed(() => visualStore.currentBlock?.key)

const canAdd = (listData?: VisualEditorListData<any>) => {
  if (!listData) return false
  if (typeof listData.maxLength === 'undefined') return true
  return listData.data.length < listData.maxLength
}

const canDel = (listData?: VisualEditorListData<any>) => {
  if (!listData) return false
  if (typeof listData.minLength === 'undefined') return true
  return listData.data.length > listData.minLength
}

const addAble = computed(() => {
  return canAdd(visualStore.visualEditorComponent?.listData)
})

const delAble = computed(() => {
  return canDel(visualStore.visualEditorComponent?.listData)
})

const handleAdd = () => {
  visualStore.visualEditorComponent?.listData?.addData()
}

const handleRemove = (index: number) => {
  visualStore.visualEditorComponent?.listData?.removeData(index)
}
</script>

<style scoped lang="scss">
.visual-list-data-options {
  & > view {
    border-bottom: 1px solid var(--el-border-color);

    &:last-child {
      border-bottom: 0;
    }
  }

  .visual-list-item-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background-color: var(--el-color-info-light-9);
  }

  .visual-del-btn {
    color: var(--el-text-color-secondary);
    cursor: pointer;
    &:hover {
      color: var(--el-color-danger);
    }
  }
}
</style>
