## [14:13] - Bug修复: 修复舞台选中组件导致数据组件数据丢失

- **文件**: `packages/visual-editor/src/components/visual-stage-panel/visual-stage-panel.vue`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-sandbox-controller.ts`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-sandbox-protocol.ts`, `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-sandbox-protocol.test.ts`
- **决策**: 将组件选中同步拆分为轻量的 `stage-selection-sync` 消息，避免选中变化触发页面树重同步和数据组件重新挂载。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过，9 个测试文件、47 个测试全部通过。

## [14:17] - Bug修复: 修复属性更新触发数据组件重新挂载

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/stage-state-sync.ts`, `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-state-sync.test.ts`
- **决策**: 页面树同步按 `_vid` 就地合并，更新属性和嵌套结构时复用已有组件对象，避免数据组件实例被整体替换。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过，10 个测试文件、49 个测试全部通过。

## [14:27] - Bug修复: 修复快速连续点击导致选中状态循环

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`
- **决策**: 让独立的选中同步消息复用 `createStageSelectionSync` 的过期回传保护，忽略较早点击的宿主回传，保留最新本地选中。
- **验证**: `stage-selection-sync.test.ts` 通过，3 个测试全部通过；`pnpm --filter @visual/editor type-check` 通过。

## [14:24] - 根因修复: 防止编辑器空 listData 覆盖运行时数据

- **文件**: `packages/visual-editor/src/components/visual-blocks/components/use-component.vue`
- **决策**: 仅当页面配置或父级数据上下文实际提供 `listData` 时才透传 `list-data`，不再用临时空数组覆盖数据组件内部的已解析数据。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过，10 个测试文件、49 个测试全部通过。

## [14:21] - 回归修复: 保持舞台 slot 树引用稳定

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/stage-state-sync.ts`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-state-sync.test.ts`
- **决策**: 页面树同步进一步改为 block、slot、blocks 数组全部原地更新，避免嵌套节点因 slot 引用替换而重新挂载。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过，10 个测试文件、49 个测试全部通过。
## [14:40] - 功能实现: 新增前景色主题 token 并用于搜索框内层背景

- **文件**: `packages/visual-ui/src/utils/theme-utils.ts`, `packages/visual-ui/src/components/visual-search/visual-search.vue`, `packages/visual-editor/src/components/visual-color-picker/configs/colorMap.ts`, `packages/visual-editor/src/configs/visual-theme.test.ts`
- **决策**: `foreground-color` 亮色使用 `#F3F4F6`，暗色使用 `#111827`，保留 `surface-color` 作为卡片表面色；`visual-search__inner` 改用前景色避免亮色下与页面背景重叠。
- **验证**: `pnpm --filter @visual/editor test -- src/configs/visual-theme.test.ts` 通过（1 个文件、5 个测试）；`pnpm --filter @visual/editor type-check` 通过。
## [14:44] - 功能实现: 恢复页面属性主题颜色配置

- **文件**: `packages/visual-editor/src/layout/components/visual-options/components/visual-page-options/visual-page-options.vue`, `packages/visual-editor/src/views/index/index.vue`
- **决策**: 恢复主题颜色控件并绑定 `pageConfig.themeName`；加载页面时保留 `schema.themeName`，避免已保存配置被强制清空。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过（仅有仓库现存的换行符提示）。
## [14:51] - Bug修复: 页面主题色实时同步到舞台 iframe

- **文件**: `packages/visual-editor/src/components/visual-stage-panel/visual-stage-panel.vue`, `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`, `packages/visual-editor/src/components/visual-stage-sandbox/stage-sandbox-protocol.ts`
- **决策**: 状态同步消息携带页面最终主色，舞台 iframe 收到后重新初始化主题 token，使组件引用的 `--v-primary-*` 变量立即更新；清空页面主题色时回退应用主色。
- **验证**: `pnpm --filter @visual/editor test -- src/components/visual-stage-sandbox/stage-sandbox-protocol.test.ts` 通过（4 个测试）；`pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过（仅有换行符提示）。
