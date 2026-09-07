session-id: 20260907-1047

## [10:47] - 组件修复: 完成详情、权限与用户卡片的编辑器体验修复

- **文件**: `packages/visual-editor/src/packages/modules/visual-{article-detail,product-detail,user-card}.ts`、`packages/visual-ui/src/components/visual-{article-detail,product-detail,auth-guard,user-card}/`、`packages/visual-ui/src/hooks/useH5Runtime.ts`、`apps/h5/app/components/AppShell.vue`、`apps/h5/server/api/user/[userId].get.ts`、四个组件 SVG
- **决策**: 删除详情组件无业务用途的顶部/底部插槽；用户 ID 查询仅允许读取当前认证用户的最小资料字段，防止借组件枚举其他账户。
- **验证**: `pnpm --filter @visual/editor test`（24/24 通过）；`pnpm --filter @visual/editor type-check` 与 `pnpm --filter @visual/h5 type-check` 通过。

## [11:36] - 功能实现: 详情实体远程选择与移动优先用户卡片

- **文件**: `packages/visual-editor/src/components/visual-control/visual-remote-entity-select/`、编辑器控件契约与详情模块、`apps/web/src/main.ts`、`apps/web/src/views/editor/EditorShell.vue`、`packages/visual-ui/src/components/visual-user-card/`
- **决策**: 远程选择器由 Web 宿主注入当前账号可访问的商品/文章服务，打开和初始化时均加载 10 条，输入标题后远程搜索；线上 H5 详情接口不变。
- **验证**: `pnpm --filter @visual/editor test`（25/25 通过）；编辑器与 H5 类型检查通过；Web 生产构建通过。

## [11:40] - 路由修复: 清理文章编辑页的列表筛选参数

- **文件**: `apps/web/src/views/admin/articles/composables/useArticlesPage.ts`、`apps/web/src/views/admin/articles/ArticleEditView.vue`
- **决策**: 新增、编辑和返回文章列表的路由不再携带列表筛选状态，编辑 URL 仅保留资源标识。
- **验证**: `pnpm --filter @visual/web build` 通过。

## [13:50] - 功能实现: 舞台 iframe 沙盒与跨文档拖拽桥接

- **文件**: `apps/web/visual-stage.html`、`apps/web/src/editor-stage-main.ts`、`apps/web/vite.config.ts`、`packages/visual-editor/src/components/visual-stage-{panel,sandbox}/`、`packages/visual-editor/src/components/visual-blocks/visual-blocks.vue`、物料组件组、`pnpm-lock.yaml`
- **决策**: 中央舞台使用同源 iframe 独立运行；父窗口负责拖拽预览与插入指示器，iframe 通过 `DropRegistry` 完成命中与提交；拖拽库统一迁移到 `vue-draggable-plus`。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 25/25 测试通过；`pnpm --filter @visual/web build` 通过并产出 `dist/visual-stage.html`。全仓 lint 仍有 6 个既有属性顺序问题，未涉及本次改动。

## [14:27] - Bug 修复: 收窄舞台沙箱边界并修复跨文档响应式数据克隆

- **文件**: `packages/visual-editor/src/components/visual-stage-panel/visual-stage-panel.vue`、`visual-stage-canvas-content.vue`、`visual-stage-sandbox/stage-sandbox-protocol.ts`、协议测试
- **决策**: 父窗口保留设备尺寸、舞台外壳和滚动容器，iframe 只负责 `VisualApp + VisualBlocks` 组件渲染；所有跨 iframe 消息先递归解除 Vue Proxy，再执行 structured clone。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 26/26 测试通过。

## [14:36] - Bug 修复: 舞台主题、尺寸、横向溢出与物料拖拽

- **文件**: `packages/visual-ui/src/components/visual-app/visual-app.vue`、`packages/visual-editor/src/components/visual-stage-panel/`、`visual-stage-sandbox/visual-stage-canvas.vue`、`stage-sandbox-controller.ts`
- **决策**: 移除 `visual-app` 根节点主题内联样式，主题变量仅写入当前 iframe 的 `html`；父窗口控制设备尺寸和舞台高度；同时兼容 pointer/mouse 捕获事件，确保物料拖拽可跨入 iframe。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 26/26 测试通过；`git diff --check` 无空白错误。

## [14:45] - Bug 修复: 物料跨 iframe 拖拽释放与舞台反馈

- **文件**: `packages/visual-editor/src/layout/components/visual-components/visual-component-group/visual-component-group.vue`、`packages/visual-editor/src/components/visual-stage-panel/visual-stage-panel.vue`
- **决策**: 物料列表保留 `VueDraggable` 作为列表容器，但禁用其 Sortable 实际拖拽，避免与跨 iframe DragSession 抢占鼠标释放；父窗口统一捕获 pointer/mouse 移动、释放和失焦并清理拖拽状态。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；之前编辑器 26/26 测试通过。

## [14:53] - 交互修复: 物料拖拽阈值、插入线与 iframe 主题隔离

- **文件**: `stage-sandbox-controller.ts`、`visual-component-group.vue`、`visual-blocks.vue`、`visual-stage-panel.vue`、`plugins/visual-components/index.ts`、`apps/web/src/editor-stage-main.ts`、`visual-ui/components/visual-app/visual-app.vue`
- **决策**: 点击物料仅建立 pending drag，移动超过 5px 后才创建 DragSession；插入预览使用目标容器的实时插入线；宿主不挂载视觉主题变量，只有 iframe 初始化主题。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 26/26 测试通过。

## [15:00] - 交互修复: 移除物料浮框并在 iframe 内完成实时插入

- **文件**: `visual-stage-panel.vue`、`visual-stage-sandbox/visual-stage-canvas.vue`、`visual-stage-controller.ts`、`visual-blocks.vue`、`visual-component-group.vue`、`plugins/visual-components/index.ts`、`apps/web/src/editor-stage-main.ts`
- **决策**: 拖拽反馈只保留舞台插入线；iframe 在物料拖拽期间接收指针移动和释放，直接以实时命中索引提交插入，避免放下后再排序。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 26/26 测试通过。

## [15:02] - Bug 修复: 恢复跨 iframe 拖拽的即时会话创建

- **文件**: `visual-component-group.vue`
- **决策**: 物料按下时立即创建 DragSession（不再等待移动阈值），但继续隐藏浮动预览；避免鼠标跨越父窗口与 iframe 边界前 session 尚未创建导致拖拽失效。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；编辑器 26/26 测试通过。

## [15:10] - Bug 修复: 补齐拖拽可视反馈并恢复工具栏排序

- **文件**: `packages/visual-editor/src/components/visual-stage-panel/visual-stage-panel.vue`、`packages/visual-editor/src/hooks/useBlocks.ts`
- **决策**: 父窗口增加跟随指针的物料拖拽影子；iframe 选中组件后，父窗口按 `_vid` 递归恢复其数组、索引和父容器，使上移/下移/复制/删除继续操作真实状态。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过（5 个测试文件、26 个测试）；`git diff --check` 无空白错误。编辑器库构建仍受应用侧 `/image/coding.svg` 路径阻断，Web 构建仍受本地 `nprogress.css` 权限阻断。

## [15:17] - Bug 修复: 修正拖拽预览坐标与舞台落点命中

- **文件**: `visual-stage-panel.vue`、`stage-sandbox-controller.ts`、`visual-stage-canvas.vue`、`drop-registry.ts`
- **决策**: 拖拽反馈层移出舞台的布局包含上下文；预览消息携带 iframe 内指针坐标并转换为宿主坐标；drop registry 增加基于容器几何范围的命中兜底。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test` 通过（5 个测试文件、26 个测试）；`git diff --check` 无空白错误。

## [15:24] - 结构调整: 移除舞台沙箱冗余根容器

- **文件**: `visual-stage-canvas.vue`、`visual-stage-canvas-content.vue`
- **决策**: 删除 `visual-stage-sandbox-root` 和 `visual-stage-root` 包裹层，将 `visual-editor-app` 与舞台尺寸属性直接挂到 `visual-app` 根节点。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；源码中已无 `visual-stage-sandbox-root` 或 `visual-stage-root` 引用。

## [15:36] - 重构: 统一浮层组件使用 Vue Teleport 并移除 isDesign 属性逻辑

- **文件**: `packages/visual-ui/src/components/visual-popup/visual-popup.vue`、`packages/visual-ui/src/components/visual-float-action/visual-float-action.vue`、`packages/visual-editor/src/components/visual-blocks/components/use-component.vue`、`packages/visual-editor/src/components/visual-blocks/visual-blocks.vue`、`packages/visual-editor/src/utils/visual.filter.ts`、`.prettierignore`
- **决策**: 浮层直接使用 `<teleport to="body">`；移除组件属性 `isDesign` 及设计态渲染、交互和样式分支。旧 teleport-box 文件因只读挂载未能删除，但已无任何调用方。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 无空白错误；`@visual/ui` 类型检查受仓库既有缺失的 React/Tiptap 依赖阻断。

## [15:52] - Bug 修复: 将拖拽预览与线框状态迁移到 iframe 舞台

- **文件**: `visual-stage-panel.vue`、`visual-stage-canvas-content.vue`、`visual-stage-canvas.vue`、`drop-registry.ts`、`visual.common.scss`、`visual.layout.scss`、`visual.utils.ts`
- **决策**: 移除宿主层拖拽 ghost/indicator，使用 iframe 内真实组件边界的插入线与空槽高亮；优化 drop registry 命中；为对象/对象数组补充类型兜底并同步预览禁用 class。
- **验证**: `pnpm --filter @visual/editor test` 通过（5 个测试文件、26 个测试）；`pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor build` 通过。

## [16:08] - Bug 修复: 同步 iframe 与浏览器暗色/亮色模式

- **文件**: `stage-sandbox-protocol.ts`、`visual-stage-panel.vue`、`visual-stage-canvas.vue`
- **决策**: 宿主监听 `html.dark` class，将主题模式通过舞台协议同步到 iframe；iframe 同步 `html.dark` 与 `color-scheme`，并在销毁时解除监听。
- **验证**: `pnpm --filter @visual/editor type-check`、`pnpm --filter @visual/editor test`（26/26）、`pnpm --filter @visual/editor build` 均通过。

## [16:15] - Bug 修复: 为 iframe 加载 Element Plus 暗色变量

- **文件**: `apps/web/src/editor-stage-main.ts`
- **决策**: iframe 独立入口显式引入 `element-plus/theme-chalk/dark/css-vars.css`，配合已同步的 `html.dark` class，使 `--el-color-info-light-9` 等暗色变量在 iframe 内生效。
- **验证**: 编辑器类型检查、测试和构建通过；Web 构建受既有 `nprogress/nprogress.css` Windows 拒绝访问阻断。

## [16:22] - 修复: 兼容低 target 的 NodeList 遍历

- **文件**: `visual-blocks.vue`、`drop-registry.ts`
- **决策**: 将 `NodeListOf<HTMLElement>` 的展开运算符改为 `Array.from`，避免未启用 `downlevelIteration` 时的 TypeScript 编译错误。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；测试 26/26 通过。

## [16:29] - 修复: 清理其它低 target 可迭代对象展开

- **文件**: `drop-registry.ts`、`useSchema.ts`、`visual-tabbar.vue`
- **决策**: 将 Map/Set/数组的展开复制统一改为 `Array.from`，避免不同 TypeScript target 下触发 `downlevelIteration` 诊断。
- **验证**: `@visual/editor` 类型检查通过；测试 26/26 通过；`@visual/ui` 类型检查仍受仓库既有 React/Tiptap 缺失依赖阻断；`git diff --check` 通过。

## [17:10] - 功能实现: 跨 iframe 拖拽改为宿主事务提交

- **文件**: `stage-sandbox-protocol.ts`、`stage-sandbox-controller.ts`、`stage-block-operations.ts`、`visual-stage-canvas.vue`、`visual-stage-panel.vue`、`visual-blocks.vue`、`useBlocks.ts`
- **决策**: 升级同源舞台协议为带 revision、sequence 与 operationId 的类型安全信封；iframe 只提交 insert/move 意图，宿主为唯一 blocks 写入者；素材拖拽使用 Pointer Events、pointer capture 与跨 iframe 浮层。
- **验证**: `pnpm --filter @visual/editor test` 32/32 通过；`pnpm --filter @visual/editor type-check` 与 `pnpm --filter @visual/web type-check` 通过。
