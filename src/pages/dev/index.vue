<template>
  <el-config-provider :locale="zhCn">
    <visual-image-text-one :props="bindProps" :list-data="bindListData" />
  </el-config-provider>
</template>

<script setup lang="ts">
import type {
  VisualImageTextItem,
  VisualImageTextProps,
} from '@/uni_modules/visual-components/components/visual-image-text-one/interface'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const bindProps = ref<VisualImageTextProps>({
  // layout: 'layout-item-list',
  // layout: 'layout-item-card-col-1',
  // layout: 'layout-item-card-col-2',
  layout: 'layout-item-card-scroll-x',
  showAuthor: true,
  showTime: true,
})

const bindListData = ref<VisualImageTextItem[]>([
  {
    cover: 'https://picsum.photos/120/120',
    authorAvatar: 'https://picsum.photos/120/120',
    authorName: '王之涣',
    title: '白日依山尽，黄河入海流，欲穷千里目，更上一层楼',
    publishTime: '三天前',
  },
  {
    cover: 'https://picsum.photos/120/120',
    authorAvatar: 'https://picsum.photos/120/120',
    authorName: '王之涣',
    title: '白日依山尽，黄河入海流，欲穷千里目，更上一层楼',
    publishTime: '三天前',
  },
  {
    cover: 'https://picsum.photos/120/120',
    authorAvatar: 'https://picsum.photos/120/120',
    authorName: '王之涣',
    title: '白日依山尽，黄河入海流，欲穷千里目，更上一层楼，白日依山尽，黄河入海流，欲穷千里目，更上一层楼',
    publishTime: '三天前',
  },
])
</script>

<style scoped></style>
