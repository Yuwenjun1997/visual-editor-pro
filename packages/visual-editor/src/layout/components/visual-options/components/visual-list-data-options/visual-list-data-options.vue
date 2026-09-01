<template>
  <div class="visual-list-data-options">
    <template
      v-for="(option, index) in visualOptions"
      :key="index"
    >
      <visual-collapse :title="`第${index + 1}项`">
        <template #right>
          <div
            v-if="delAble"
            class="visual-del-btn"
            @click.stop="handleRemove(index)"
          >
            <Icon icon="bi:trash" />
          </div>
        </template>
        <div class="visual-list-item-options">
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
          </visual-control-item>
        </div>
      </visual-collapse>
    </template>
    <div
      v-if="addAble"
      class="ve-p-1"
    >
      <el-button
        size="small"
        class="ve-w-full"
        @click="handleAdd"
      >
        +添加项目
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '../../../../../components/visual-collapse/visual-collapse.vue'
import VisualControlItem from '../../../../../components/visual-control-item/visual-control-item.vue'
import VisualPxInput from '../../../../../components/visual-control/visual-px-input/visual-px-input.vue'
import VisualNumberInput from '../../../../../components/visual-control/visual-number-input/visual-number-input.vue'
import VisualNormalSelect from '../../../../../components/visual-control/visual-normal-select/visual-normal-select.vue'
import VisualImageInput from '../../../../../components/visual-control/visual-image-input/visual-image-input.vue'
import VisualColorInput from '../../../../../components/visual-control/visual-color-input/visual-color-input.vue'
import VisualIconInput from '../../../../../components/visual-control/visual-icon-input/visual-icon-input.vue'
import VisualTextInput from '../../../../../components/visual-control/visual-text-input/visual-text-input.vue'
import { VisualEditorType, type VisualEditorListData } from '../../../../../types/visual-editor'
import { useViusalStore } from '../../../../../store/useVisual'

const visualStore = useViusalStore()
const visualOptions = computed(() => visualStore.visualEditorComponent?.listData?.data)

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
  & > div {
    border-bottom: 1px solid var(--el-border-color);

    &:last-child {
      border-bottom: 0;
    }

    &:nth-child(1) {
      border-top: 1px solid var(--el-border-color);
    }
  }

  .visual-list-item-options {
    display: flex;
    flex-direction: column;
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
