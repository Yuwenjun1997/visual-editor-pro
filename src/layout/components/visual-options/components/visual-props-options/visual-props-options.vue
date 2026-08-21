<template>
  <div class="visual-props-options">
    <template v-for="item in visualOptions">
      <visual-control-item :title="item.label">
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
        <template v-else-if="item.type === VisualEditorType.datePicker">
          <el-date-picker
            v-model="item.defaultValue"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束时间"
            :clearable="true"
            style="width: 100%"
          />
        </template>
        <template v-else-if="item.type === VisualEditorType.sourceData">
          <visual-source-data-control
            v-if="visualKey"
            v-model="item.defaultValue"
            :visualKey="visualKey"
          />
        </template>
      </visual-control-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import VisualControlItem from '@/components/visual-control-item/visual-control-item.vue'
import VisualPxInput from '@/components/visual-control/visual-px-input/visual-px-input.vue'
import VisualNumberInput from '@/components/visual-control/visual-number-input/visual-number-input.vue'
import VisualNormalSelect from '@/components/visual-control/visual-normal-select/visual-normal-select.vue'
import VisualImageInput from '@/components/visual-control/visual-image-input/visual-image-input.vue'
import VisualColorInput from '@/components/visual-control/visual-color-input/visual-color-input.vue'
import VisualTextInput from '@/components/visual-control/visual-text-input/visual-text-input.vue'
import VisualIconInput from '@/components/visual-control/visual-icon-input/visual-icon-input.vue'
import VisualSourceDataControl from '@/components/visual-control/visual-source-data-editor/visual-source-data-control.vue'
import { VisualEditorType } from '@/types/visual-editor'
import { useViusalStore } from '@/store/useVisual'

const visualStore = useViusalStore()
const visualOptions = computed(() => visualStore.visualEditorComponent?.props)

const visualKey = computed(() => visualStore.currentBlock?.key)
</script>

<style scoped lang="scss">
.visual-props-options {
  & > div {
    border-bottom: 1px solid var(--el-border-color);

    &:last-child {
      border-bottom: 0;
    }

    &:nth-child(1) {
      border-top: 1px solid var(--el-border-color);
    }
  }
}
</style>
