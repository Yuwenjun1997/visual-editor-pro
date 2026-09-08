## [12:15] - Bug 修复: 稳定 iframe 舞台与宿主的快速选中同步

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`、`stage-selection-sync.ts`、`stage-selection-sync.test.ts`
- **决策**: 舞台端以最新本地选择为准，忽略宿主较早的确认回传；宿主同步触发的选中变化不再反向发送，并拒绝旧 revision 状态。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test -- --reporter=verbose` 通过（35/35）。

## [12:24] - Bug 修复: 将舞台组件选择前移到指针捕获阶段

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`
- **决策**: 在 iframe document 的捕获阶段解析命中的 `.visual-block`，立即更新本地选中并发送请求，避免被子组件或拖拽库的冒泡事件处理吞掉。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test -- --reporter=verbose` 通过（35/35）。

## [12:48] - 代码清理: 收敛舞台拖拽通信与移除旧 Teleport 实现

- **文件**: `packages/visual-editor/src/components/visual-{blocks,stage-sandbox}/`、`packages/visual-ui/src/deps/teleport-box/index.vue`
- **决策**: 删除无消费者的拖拽预览消息、直接 iframe 提交接口和启动通知；宿主继续作为拖放操作唯一提交者，内部排序仅在结束时请求宿主提交。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test -- --reporter=verbose` 通过（35/35）；`pnpm lint` 因本地缺失 `optionator` 无法启动。

## [13:30] - 功能实现: 舞台通过受限 RPC 读取详情与托管数据源预览

- **文件**: `apps/web/src/editor-stage-main.ts`、`apps/web/supabase/migrations/20260908130000_stage_preview_readonly.sql`、`packages/visual-editor/src/utils/visual.data-source.ts`
- **决策**: iframe 独立注入 H5 runtime 与舞台数据 provider；RPC 仅允许当前登录编辑者读取自己的已发布内容与已启用数据源，失败时清空旧数据。
- **验证**: `pnpm --filter @visual/editor test` 通过（38/38）；`pnpm --filter @visual/editor type-check` 和 `pnpm --filter @visual/web type-check` 通过。

## [13:45] - 架构调整: 舞台数据源读取统一归入 H5 runtime

- **文件**: `packages/visual-ui/src/hooks/useH5Runtime.ts`、`apps/web/src/editor-stage-main.ts`、`packages/visual-editor/src/utils/visual.data-source.ts`
- **决策**: 新增 `$dataSource` runtime 能力，舞台与详情的 RPC 读取均由 `provideH5Runtime` 管理；普通编辑器仍回退原数据源 provider。
- **验证**: `pnpm --filter @visual/editor test` 通过（38/38）；`pnpm --filter @visual/editor type-check` 通过。

## [14:05] - 数据库清理: 统一 Supabase RPC 命名并移除废弃入口

- **文件**: `apps/web/supabase/migrations/20260908150000_rpc_function_naming_cleanup.sql`、`apps/web/src/services/`、`apps/h5/server/utils/runtime.ts`
- **决策**: 采用 `域_动作_资源_场景` 命名，更新全部仓内调用；删除已被 `page_write_draft` 替代的 `save_page_with_data_source_bindings`，不保留旧名兼容层。
- **验证**: 全仓旧 RPC 调用检索为空；`pnpm --filter @visual/editor test` 通过（38/38）；`pnpm --filter @visual/editor type-check` 通过。

## [14:25] - 功能实现: 完善编辑器舞台操作与详情空态

- **文件**: `packages/visual-editor/src/components/visual-stage-{bar,panel,sandbox}/`、`packages/visual-editor/src/hooks/useBlocks.ts`、`packages/visual-ui/src/components/visual-detail-empty-state/`、`apps/web/src/editor-stage-main.ts`
- **决策**: 模拟身份由舞台工具栏全局控制并同步至 iframe runtime；详情组件共用带图标的未配置内容空态。
- **验证**: `pnpm --filter @visual/editor test` 通过（40/40）；编辑器与 Web type-check 通过。

## [14:45] - 代码重构: 详情组件样式本地化并统一 visual-ui BEM 类名

- **文件**: `packages/visual-ui/src/components/visual-{article-detail,product-detail,detail-empty-state,user-card,login-panel}/`、`packages/visual-ui/src/assets/scss/content.scss`
- **决策**: 组件统一使用 `visual-<block>__<element>--<modifier>`；详情与富文本规则随各自组件加载，移除全局内容样式入口。
- **验证**: 目标文件 Prettier 检查通过；BEM 历史类扫描为空。`type-check` 与 ESLint 被工作区缺失的 React/Tiptap / optionator 依赖阻断。

## [16:40] - 功能实现: 精简颜色输入预设并支持自定义颜色

- **文件**: `packages/visual-editor/src/components/visual-color-picker/`、`packages/visual-editor/src/components/visual-control/visual-color-input/`
- **决策**: 颜色预设仅展示当前主题的语义色，不再展开深浅阶梯色；增加 `el-color-picker` 支持用户自由选择颜色。
- **验证**: `pnpm --filter @visual/editor type-check` 通过。

## [16:52] - 主题调整: 语义 CSS 变量改为引用基础令牌

- **文件**: `packages/visual-ui/src/utils/theme-utils.ts`、`packages/visual-ui/src/components/visual-app/visual-app.vue`、`packages/visual-ui/src/hooks/useMountThemeToRoot.ts`、`packages/visual-editor/src/configs/visual-theme.test.ts`
- **决策**: `--v-*-color` 与 `--v-bg-color` 的 CSS 值统一引用现有 `--v-*` 基础令牌，避免重复写入实际颜色值。
- **验证**: `pnpm --filter @visual/editor test` 通过（42/42）；`pnpm --filter @visual/editor type-check` 通过。

## [17:54] - Bug 修复: 修复舞台空插槽、页签内容与五个组件主题背景适配

- **文件**: `packages/visual-ui/src/components/visual-flex/visual-flex.vue`、`visual-tabs/visual-tabs.vue`、`visual-notice-bar/visual-notice-bar.vue`、`visual-popup/visual-popup.vue`、`visual-float-action/visual-float-action.vue`
- **决策**: Flex 内容区占满可用高度；Tabs 设置首个页签初始值并强制保留插槽内容挂载；通知条、弹窗和浮动按钮统一使用 `--v-*` 主题令牌，弹窗渐变背景移除硬编码覆盖层。
- **验证**: `pnpm --filter @visual/ui build:lib -- --minify false` 通过；`pnpm --filter @visual/editor test` 通过（42/42）；`pnpm --filter @visual/editor type-check` 通过；目标文件 `git diff --check` 无空白错误。

## [18:00] - Bug 修复: 进一步修复 Flex 高度链与 Tabs 舞台插槽生命周期

- **文件**: `packages/visual-ui/src/components/visual-flex/visual-flex.vue`、`packages/visual-ui/src/components/visual-tabs/visual-tabs.vue`
- **决策**: 通过 `:deep(.visual-box__inner)` 补齐 Flex 子组件内层高度；Tabs 内容改为组件自身的 `v-show` 活动面板，保留舞台插槽实例，避免 Reka `TabsContent` 的 Presence 卸载影响编辑器拖拽插槽。
- **验证**: `pnpm --filter @visual/ui build:lib -- --minify false` 通过；`pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过（42/42）。

## [18:08] - Bug 修复: 统一组件库 library CSS 输出文件名

- **文件**: `packages/visual-ui/vite.config.ts`、`packages/visual-editor/vite.config.ts`
- **决策**: Vite library build 的 CSS 文件名统一为 `style.css`，与两个包的 `exports` 和 Web/H5 入口导入路径一致，避免构建清理 dist 后丢失入口样式。
- **验证**: `pnpm --filter @visual/ui build` 通过且 `packages/visual-ui/dist/style.css` 存在；`@visual/ui build:lib` 通过并生成 `dist/style.css`。`@visual/editor build:lib` 仍被既有 `/image/coding.svg` unresolved import 阻断。

## [18:14] - Bug 修复: 初始化 VisualTabs 物料默认内容插槽

- **文件**: `packages/visual-editor/src/packages/modules/visual-tabs.ts`
- **决策**: 为默认三页签创建 `tab-0`、`tab-1`、`tab-2` 空 slots，使从物料面板新拖入的页签也能在舞台注册内容拖放容器；页签增删仍由现有状态同步逻辑维护。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过（42/42）。

## [18:18] - Bug 修复: 兼容旧 VisualTabs 数据并补充插槽回归测试

- **文件**: `packages/visual-editor/src/utils/visual.utils.ts`、`packages/visual-editor/src/utils/visual.utils.test.ts`
- **决策**: 页面数据格式化时按 `listData` 自动补齐缺失的 `tab-*` slots，并保留已有页签内容，避免历史页面仍无法拖放。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过（44/44）；目标文件 `git diff --check` 无空白错误。

## [18:32] - Bug 修复: 显式打包 Web 与舞台的 Element Plus 基础样式

- **文件**: `apps/web/src/plugins/element-ui/index.ts`、`apps/web/src/editor-stage-main.ts`
- **决策**: 主应用与独立 iframe 舞台均显式引入 `element-plus/dist/index.css`，不再依赖开发环境的组件按需样式注入。
- **验证**: `pnpm --filter @visual/web build` 通过；生产产物 CSS 检索到 `.el-button`、`.el-tabs`、`--el-color-primary` 等 Element Plus 规则。
