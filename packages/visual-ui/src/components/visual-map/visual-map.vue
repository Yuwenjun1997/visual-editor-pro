<template>
  <visual-box class="visual-map" :class="_props.class" :styles="_props.styles">
    <div class="visual-map__inner" :style="_bindInnerStyles">
      <div class="visual-map__map" :style="_bindMapStyles">
        <iframe
          title="地图"
          :src="mapUrl"
          loading="lazy"
          class="visual-map__frame"
          referrerpolicy="no-referrer-when-downgrade"
        />
        <div v-if="_bindProps.title" class="visual-map__title">
          {{ _bindProps.title }}
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
  '--visual-map-map-width': _bindProps.value.width,
  '--visual-map-map-height': _bindProps.value.height,
  '--visual-map-map-radius': cssRadiusVar(_bindProps.value.round),
}))

const _bindMapStyles = computed<CSSProperties>(() => ({
  width: _bindProps.value.width,
  height: _bindProps.value.height,
  borderRadius: cssRadiusVar(_bindProps.value.round),
}))

const _longitude = ref(_bindProps.value.longitude || 0)
const _latitude = ref(_bindProps.value.latitude || 0)

const mapUrl = computed(() => {
  const longitude = Math.min(180, Math.max(-180, Number(_longitude.value) || 0))
  const latitude = Math.min(85, Math.max(-85, Number(_latitude.value) || 0))
  const zoom = Math.min(19, Math.max(1, Number(_bindProps.value.scale) || 12))
  const longitudeDelta = 180 / 2 ** zoom
  const latitudeDelta = 85 / 2 ** zoom
  const params = new URLSearchParams({
    bbox: [
      longitude - longitudeDelta,
      latitude - latitudeDelta,
      longitude + longitudeDelta,
      latitude + latitudeDelta,
    ].join(','),
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  })
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`
})

onMounted(() => {
  if (_bindProps.value.autoLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        _longitude.value = position.coords.longitude
        _latitude.value = position.coords.latitude
      },
      () => undefined,
    )
  }
})
</script>

<style scoped lang="scss">
.visual-map {
  --visual-map-gray-6: var(--v-gray-6, #f5f7fa);
  --visual-map-gray-4: var(--v-gray-4, #dcdfe6);
  --visual-map-text-4: var(--v-text-4, #909399);
  --visual-map-text-1: var(--v-text-1, #303133);
  .visual-map__inner {
    .visual-map__map {
      position: relative;
      width: var(--visual-map-map-width, 100%);
      height: var(--visual-map-map-height, 180px);
      border-radius: var(--visual-map-map-radius);
      overflow: hidden;
      background-color: var(--visual-map-gray-6, #f5f7fa);
      border: 1px solid var(--visual-map-gray-4, #dcdfe6);
    }

    .visual-map__frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }

    .visual-map__title {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 1;
      margin-top: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgb(255 255 255 / 88%);
      font-weight: 500;
      color: var(--visual-map-text-1, #303133);
    }
  }
}
</style>
