<template>
  <visual-box
    class="visual-carousel"
    :styles="_props.styles"
    :show-empty="_noListData"
  >
    <el-carousel
      :autoplay="_bindProps.autoplay"
      :interval="_bindProps.interval"
      :duration="_bindProps.duration"
      :loop="_bindProps.circular"
      :direction="_bindProps.vertical ? 'vertical' : 'horizontal'"
      :height="_bindProps.height || '200px'"
      @change="_onChange"
    >
      <el-carousel-item v-for="(item, index) in _props.listData" :key="index">
        <div :style="_bindSwiperItemStyles" class="visual-carousel-item">
          <img
            :src="item.image"
            :style="_bindImageStyles"
            style="object-fit: cover"
          />
        </div>
      </el-carousel-item>
    </el-carousel>
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

const _bindSwiperItemStyles = computed<CSSProperties>(() => ({
  padding: `0 ${_props.props.gap}`,
  height: '100%',
}))

const _bindImageStyles = computed<CSSProperties>(() => ({
  borderRadius: _props.props.radius,
  width: '100%',
  height: '100%',
}))

const _currentIndex = ref(0)
const _onChange = (index: number) => {
  _currentIndex.value = index
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

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
