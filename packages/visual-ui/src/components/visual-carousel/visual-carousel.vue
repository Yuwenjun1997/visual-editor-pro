<template>
  <visual-box
    class="visual-carousel"
    :styles="_props.styles"
    :show-empty="_noListData"
  >
    <swiper
      :key="_swiperKey"
      :modules="_swiperModules"
      :loop="_enableLoop"
      :autoplay="_autoplay"
      :direction="_props.props.vertical ? 'vertical' : 'horizontal'"
      :speed="_duration"
      :slides-per-view="1"
      :style="{ height: _height }"
      @slide-change="_onChange"
    >
      <swiper-slide v-for="(item, index) in _props.listData" :key="index">
        <div :style="_bindSwiperItemStyles" class="visual-carousel-item">
          <img
            :src="item.image"
            :style="_bindImageStyles"
            style="object-fit: cover"
          />
        </div>
      </swiper-slide>
    </swiper>
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
import VisualBox from '../visual-box/visual-box.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/autoplay'
import type { CSSProperties } from 'vue'
import type { VisualCarouselItem, VisualCarouselProps } from './interface'
import VisualIndicator from './components/visual-indicator.vue'

interface Props {
  styles?: CSSProperties
  props: VisualCarouselProps
  listData: VisualCarouselItem[]
}

defineOptions({
  name: 'VisualCarousel',
})

const _props = defineProps<Props>()

const _noListData = computed(() => _props.listData.length <= 0)

const _bindProps = computed<VisualCarouselProps>(() => ({
  ..._props.props,
}))

const _swiperModules = [Autoplay]

const _height = computed(() => _props.props.height || '200px')
const _enableLoop = computed(
  () => !!_props.props.circular && _props.listData.length > 1
)
const _interval = computed(() => Number(_props.props.interval) || 3000)
const _duration = computed(() => Number(_props.props.duration) || 300)
const _autoplay = computed(() =>
  _props.props.autoplay
    ? {
        delay: _interval.value,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        stopOnLastSlide: !_enableLoop.value,
      }
    : false
)

// The swiper/vue wrapper never re-creates its instance on prop changes, and its
// generic param merge cannot toggle loop or autoplay at runtime — remount when
// either structural flag flips. Children/direction/speed changes still use the
// wrapper's smooth update path.
const _swiperKey = computed(() =>
  `${_enableLoop.value ? 'loop' : 'no-loop'}-${
    _props.props.autoplay ? 'play' : 'stop'
  }`
)

const _currentIndex = ref(0)
const _onChange = (swiper: SwiperType) => {
  _currentIndex.value = swiper.realIndex
}

const _bindSwiperItemStyles = computed<CSSProperties>(() => ({
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
watch(_swiperKey, () => {
  _currentIndex.value = 0
})
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
