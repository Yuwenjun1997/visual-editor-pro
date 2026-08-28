<template>
  <visual-box
    class="visual-carousel"
    :styles="_props.styles"
    :show-empty="_noListData"
    :class="_props.class"
  >
    <carousel
      :opts="carouselOpts"
      :autoplay="_bindProps.autoplay"
      :autoplay-delay="_interval"
      :style="{ height: _height }"
      @slide-change="_onChange"
    >
      <carousel-content :vertical="_bindProps.vertical">
        <carousel-item v-for="(item, index) in _props.listData" :key="index">
          <div :style="_bindItemStyles" class="visual-carousel-item">
            <img
              :src="item.image"
              :style="_bindImageStyles"
              style="object-fit: cover"
            />
          </div>
        </carousel-item>
      </carousel-content>
    </carousel>
    <template v-if="_bindProps.indicatorDots">
      <visual-indicator
        v-model:current="_currentIndex"
        :list="_props.listData"
        :type="_bindProps.indicatorDotsType"
      />
    </template>
  </visual-box>
</template>

<script setup lang="ts">
import type { EmblaOptionsType } from 'embla-carousel'
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { Carousel, CarouselContent, CarouselItem } from '../../deps/embla'
import type { VisualCarouselItem, VisualCarouselProps } from './interface'
import VisualIndicator from './components/visual-indicator.vue'

interface Props {
  styles?: CSSProperties
  props: VisualCarouselProps
  listData: VisualCarouselItem[]
  class?: string
}

defineOptions({
  name: 'VisualCarousel',
})

const _props = defineProps<Props>()

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualCarouselProps>(() => ({
  ..._props.props,
}))

const _height = computed(() => _props.props.height || '200px')
const _enableLoop = computed(
  () => !!_props.props.circular && _props.listData.length > 1
)
const _interval = computed(() => Number(_props.props.interval) || 3000)
const _duration = computed(() => Number(_props.props.duration) || 300)

const carouselOpts = computed<EmblaOptionsType>(() => ({
  loop: _enableLoop.value,
  axis: _props.props.vertical ? 'y' : 'x',
  // embla 的 duration 以动画帧计（约 16.7ms/帧），配置的毫秒需换算成帧
  duration: Math.max(1, Math.round(_duration.value / 16.7)),
}))

const _currentIndex = ref(0)
const _onChange = (index: number) => {
  _currentIndex.value = index
}

const _bindItemStyles = computed<CSSProperties>(() => ({
  padding: `0 ${_props.props.gap}`,
  height: '100%',
}))

const _bindImageStyles = computed<CSSProperties>(() => ({
  borderRadius: _props.props.radius,
  width: '100%',
  height: '100%',
}))

watch(
  () => _props.listData.length,
  (len) => {
    if (_currentIndex.value >= len) _currentIndex.value = Math.max(0, len - 1)
  }
)
</script>

<style lang="scss" scoped>
.visual-carousel {
  position: relative;
  .visual-carousel-item {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>