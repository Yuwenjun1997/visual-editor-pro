<template>
  <visual-box class="visual-map" :class="_props.class" :styles="_props.styles">
    <div class="visual-map__inner" :style="_bindInnerStyles">
      <div class="visual-map__map" :style="_bindMapStyles">
        <div class="visual-map__placeholder">
          <div>Lat: {{ _latitude }}, Lng: {{ _longitude }}</div>
          <div v-if="_bindProps.title" class="visual-map__title">
            {{ _bindProps.title }}
          </div>
        </div>
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualMapProps } from './interface'
import { cssRadiusVar } from '../../utils/styles.utils'

interface Props {
  styles?: CSSProperties
  props: VisualMapProps
  listData?: any[]
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _bindProps = computed(() => _props.props)

const _bindInnerStyles = computed<CSSProperties>(() => ({
  '--v-map-width': _bindProps.value.width,
  '--v-map-height': _bindProps.value.height,
  '--v-map-radius': cssRadiusVar(_bindProps.value.round),
  '--v-map-align': _bindProps.value.align,
}))

const _bindMapStyles = computed<CSSProperties>(() => ({
  width: _bindProps.value.width,
  height: _bindProps.value.height,
  borderRadius: cssRadiusVar(_bindProps.value.round),
}))

const _longitude = ref(_bindProps.value.longitude || 0)
const _latitude = ref(_bindProps.value.latitude || 0)

onMounted(() => {
  if (_bindProps.value.autoLocation && navigator.geolocation) {
    console.log('正在获取定位信息...')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        _longitude.value = position.coords.longitude
        _latitude.value = position.coords.latitude
      },
      (error) => {
        console.log(error)
      },
    )
  }
})
</script>

<style scoped lang="scss">
.visual-map {
  .visual-map__inner {
    display: flex;
    justify-content: var(--v-map-align, flex-start);

    .visual-map__map {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--v-map-width, 100%);
      height: var(--v-map-height, 180px);
      border-radius: var(--v-map-radius);
      overflow: hidden;
      background-color: var(--v-gray-6, #f5f7fa);
      border: 1px solid var(--v-gray-4, #dcdfe6);
    }

    .visual-map__placeholder {
      text-align: center;
      font-size: 12px;
      color: var(--v-text-4, #909399);
    }

    .visual-map__title {
      margin-top: 4px;
      font-weight: 500;
      color: var(--v-text-1, #303133);
    }
  }
}
</style>
