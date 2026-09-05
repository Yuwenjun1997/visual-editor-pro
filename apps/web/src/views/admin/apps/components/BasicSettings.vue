<template>
  <div class="wa-grid wa-gap-2 xl:wa-grid-cols-[minmax(0,1fr)_400px]">
    <div class="wa-min-w-0 wa-space-y-2">
      <el-card>
        <template #header>
          <div>
            <div class="wa-text-base wa-font-medium">基础配置</div>
            <div class="wa-mt-1 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
              配置应用名称和首页 RouteKey。
            </div>
          </div>
        </template>
        <el-form class="wa-max-w-lg" label-width="110px">
          <el-form-item label="应用名称"><el-input v-model="model.name" /></el-form-item>
          <el-form-item label="首页 RouteKey"><el-input v-model="model.home_route_key" /></el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <template #header>
          <div>
            <div class="wa-text-base wa-font-medium">底部导航配置</div>
            <div class="wa-mt-1 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">
              选择要显示的页面，并可修改导航名称和图标。导航最多显示 5 项。
            </div>
          </div>
        </template>
        <el-form label-width="90px">
          <el-form-item label="显示导航"><el-switch v-model="model.layout_config.showTabbar" /></el-form-item>
          <div class="wa-flex wa-items-center wa-gap-3">
            <el-form-item label="背景颜色">
              <el-color-picker v-model="model.layout_config.backgroundColor" />
            </el-form-item>
            <el-form-item label="激活颜色">
              <el-color-picker v-model="model.layout_config.activeColor" />
            </el-form-item>
            <el-form-item label="未激活颜色">
              <el-color-picker v-model="model.layout_config.inactiveColor" />
            </el-form-item>
          </div>
          <el-form-item label="导航项目">
            <div class="wa-w-full wa-space-y-3">
              <div
                v-for="(item, index) in model.layout_config.items"
                :key="item.key"
                class="wa-rounded-lg wa-border wa-border-[var(--el-border-color-lighter)] wa-p-3"
              >
                <div class="wa-mb-3 wa-flex wa-items-center wa-justify-between wa-gap-3">
                  <el-switch v-model="item.visible" active-text="显示" inactive-text="隐藏" />
                  <div class="wa-flex wa-items-center wa-gap-1">
                    <el-button link title="上移" :disabled="index === 0" @click="moveNavItem(index, -1)">
                      <Icon icon="ep:arrow-up" />
                    </el-button>
                    <el-button
                      link
                      title="下移"
                      :disabled="index === model.layout_config.items.length - 1"
                      @click="moveNavItem(index, 1)"
                    >
                      <Icon icon="ep:arrow-down" />
                    </el-button>
                    <el-button link type="danger" @click="removeNavItem(item.key)">移除</el-button>
                  </div>
                </div>
                <div class="wa-grid wa-grid-cols-1 wa-gap-3 sm:wa-grid-cols-2 lg:wa-grid-cols-4">
                  <el-input v-model="item.label" placeholder="导航名称" />
                  <el-input v-model="item.icon" placeholder="图标类名，如 bi bi-house" />
                  <el-select v-model="item.routeKey" placeholder="目标页面" class="sm:wa-col-span-2">
                    <el-option v-for="page in pages" :key="page.id" :label="page.title" :value="pageKey(page)" />
                  </el-select>
                </div>
              </div>
              <el-button v-if="model.layout_config.items.length < 5" link type="primary" @click="addNavItem">
                <Icon icon="ep:plus" class="wa-mr-1" />
                添加导航页面
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>

      <slot />
    </div>

    <el-card class="xl:wa-sticky xl:wa-top-0">
      <template #header>
        <div>
          <div class="wa-text-base wa-font-medium">实时预览</div>
          <div class="wa-mt-1 wa-text-[13px] wa-text-[var(--el-text-color-secondary)]">修改左侧配置后即时更新。</div>
        </div>
      </template>
      <div class="wa-flex wa-justify-center wa-py-2">
        <PreviewPhoneFrame :screen-style="{ backgroundColor: model.layout_config.backgroundColor }">
          <div class="wa-flex wa-min-h-full wa-flex-col">
            <div class="wa-border-b wa-border-black/5 wa-bg-white/80 wa-px-4 wa-py-3 wa-backdrop-blur">
              <div class="wa-truncate wa-text-center wa-text-sm wa-font-semibold wa-text-slate-800">
                {{ model.name || '未命名应用' }}
              </div>
            </div>
            <div class="wa-flex-1 wa-p-4">
              <div class="wa-rounded-xl wa-bg-white/85 wa-p-4 wa-shadow-sm">
                <div class="wa-text-sm wa-font-medium wa-text-slate-800">{{ homePageTitle }}</div>
                <div class="wa-mt-2 wa-text-xs wa-text-slate-500">
                  当前首页 RouteKey：{{ model.home_route_key || '未设置' }}
                </div>
                <div class="wa-mt-4 wa-space-y-2">
                  <div class="wa-h-2.5 wa-w-3/4 wa-rounded-full wa-bg-slate-200" />
                  <div class="wa-h-2.5 wa-w-full wa-rounded-full wa-bg-slate-100" />
                  <div class="wa-h-2.5 wa-w-2/3 wa-rounded-full wa-bg-slate-100" />
                </div>
              </div>
            </div>
            <div v-if="model.layout_config.showTabbar && previewItems.length" class="preview-tabbar wa-relative">
              <VisualTabbar
                :safe-area="false"
                :items="previewItems"
                :height="model.layout_config.tabbarHeight"
                :active-color="model.layout_config.activeColor"
                :inactive-color="model.layout_config.inactiveColor"
                :background-color="model.layout_config.backgroundColor"
              />
            </div>
          </div>
        </PreviewPhoneFrame>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import VisualTabbar from '@visual/ui/components/visual-tabbar/index'
import type { AppRow, PageRow } from '../../../../types/api'
import PreviewPhoneFrame from '../../../../components/PreviewPhoneFrame.vue'

const model = defineModel<AppRow>({ required: true })
const props = defineProps<{ pages: PageRow[]; pageKey: (page: PageRow) => string }>()

const previewItems = computed(() =>
  model.value.layout_config.items.map((item) => ({
    ...item,
    active: item.routeKey === model.value.home_route_key,
  })),
)
const homePageTitle = computed(() => {
  const page = props.pages.find((item) => props.pageKey(item) === model.value.home_route_key)
  return page?.title || '首页示例内容'
})

const addNavItem = () => {
  const page = props.pages.find(
    (item) => !model.value.layout_config.items.some((navItem) => navItem.routeKey === props.pageKey(item)),
  )
  if (!page) return ElMessage.info('没有可添加的页面')
  model.value.layout_config.items.push({
    key: `nav-${Date.now()}`,
    label: page.title || '新页面',
    icon: 'bi bi-circle',
    routeKey: props.pageKey(page),
    visible: true,
    sort: model.value.layout_config.items.length,
  })
}
const removeNavItem = (key: string) => {
  model.value.layout_config.items = model.value.layout_config.items.filter((item) => item.key !== key)
}
const moveNavItem = (index: number, direction: -1 | 1) => {
  const items = model.value.layout_config.items
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= items.length) return
  const currentItem = items[index]
  items[index] = items[nextIndex]
  items[nextIndex] = currentItem
  items.forEach((item, sort) => (item.sort = sort))
}
</script>

<style scoped>
.preview-tabbar :deep(.visual-tabbar__inner) {
  position: absolute;
}
</style>
