<template>
  <visual-box class="visual-map" :styles="_props.styles">
    <view class="visual-map__inner" :style="_bindInnerStyles">
      <map
        class="visual-map__map"
        :longitude="_longitude"
        :latitude="_latitude"
        :scale="_bindProps.scale"
        :markers="_markers"
      />
    </view>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualMapMarker, VisualMapProps } from './interface'
import { cssRadiusVar } from '../../utils/styles.utils'

interface Props {
  styles?: CSSProperties
  props: VisualMapProps
  listData: VisualMapMarker[]
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

const _locationInfo = ref<UniApp.GetLocationSuccess>()

const _longitude = computed(() => {
  return _locationInfo.value?.longitude || _bindProps.value.longitude
})
const _latitude = computed(() => {
  return _locationInfo.value?.latitude || _bindProps.value.latitude
})

const _createMarker = (options: VisualMapMarker) => ({
  latitude: options.latitude,
  longitude: options.longitude,
  title: options.title,
  iconPath: options.iconPath,
  callout: {
    content: options.title,
    display: 'ALWAYS',
    color: _bindProps.value.titleColor,
    fontSize: _bindProps.value.titleFontSize,
  },
})

const _markers = computed(() => {
  return [
    _createMarker({
      latitude: _latitude.value,
      longitude: _longitude.value,
      title: _bindProps.value.title,
      iconPath: '/static/image/location.svg',
    }),
    ..._props.listData
      .filter((item) => item.latitude && item.longitude)
      .map(_createMarker),
  ]
})

onMounted(() => {
  if (_bindProps.value.autoLocation) {
    console.log('正在获取定位信息...')
    uni.getLocation({
      success(result) {
        _locationInfo.value = result
        console.log(result)
      },
      fail(error) {
        _locationInfo.value = undefined
        console.log(error)
      },
    })
  }
})
</script>

<style scoped lang="scss">
.visual-map {
  .visual-map__inner {
    display: flex;
    justify-content: var(--v-map-align, flex-start);
    .visual-map__map {
      display: block;
      width: var(--v-map-width, 100%);
      height: var(--v-map-height, 360rpx);
      border-radius: var(--v-map-radius);
      overflow: hidden;
    }
  }
}
</style>
