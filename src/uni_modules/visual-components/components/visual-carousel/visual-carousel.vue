<template>
  <visual-box
    class="visual-carousel"
    :styles="_props.styles"
    :show-empty="_noListData"
  >
    <swiper
      :autoplay="_bindProps.autoplay"
      :interval="_bindProps.interval"
      :duration="_bindProps.duration"
      :circular="_bindProps.circular"
      :vertical="_bindProps.vertical"
      :style="_bindSwiperStyles"
      :current="_currentIndex"
      @change="_onChange"
    >
      <swiper-item v-for="(item, index) in _props.listData" :key="index">
        <view :style="_bindSwiperItemStyles" class="visual-carousel-item">
          <image
            :src="item.image"
            :style="_bindImageStyles"
            mode="cover"
          />
        </view>
      </swiper-item>
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

const _bindSwiperStyles = computed<CSSProperties>(() => ({
  height: _props.props.height,
}))

const _bindSwiperItemStyles = computed<CSSProperties>(() => ({
  padding: `0 ${_props.props.gap}`,
}))

const _bindImageStyles = computed<CSSProperties>(() => ({
  borderRadius: _props.props.radius,
}))

const _currentIndex = ref(0)
const _onChange = (e: any) => {
  _currentIndex.value = e.detail.current
}
</script>

<style lang="scss" scoped>
.visual-carousel {
  position: relative;
  .visual-carousel-item {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    image {
      display: block;
      width: 100%;
      flex: 1;
    }
  }
}
</style>
