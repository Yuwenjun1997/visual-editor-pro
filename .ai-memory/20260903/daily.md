## [当前] - Bug 修复: JSON 面板切回设计面板时兼容空样式值

- **文件**: `packages/visual-editor/src/components/visual-control/visual-px-input/visual-px-input.vue`, `packages/visual-editor/src/components/visual-styles-editor/visual-background-editor/visual-background-editor.vue`, `packages/visual-editor/src/utils/visual.utils.ts`
- **决策**: JSON 恢复允许样式字段为 `null` 或其他合法 JSON 类型；像素输入、背景样式解析均在调用字符串方法前进行空值/类型保护。
- **验证**: `git diff --check` 通过；`pnpm --filter @visual/editor type-check` 受缺失 `vue-tsc` 依赖阻断；`pnpm --filter @visual/editor test` 受缺失 `@vitest/utils` 依赖阻断。

## [当前] - Bug 修复: Monaco 编辑器切换时避免 null 命令参数与残留实例

- **文件**: `packages/visual-editor/src/components/visual-monaco-editor/visual-monaco-editor.vue`
- **决策**: 格式化命令使用空对象参数，并在组件卸载时销毁 Monaco 实例，避免切换面板触发内部 `null.toString` 及旧实例残留。
- **验证**: 已完成源码静态复核；类型检查仍受工作区缺失依赖阻断。

## [当前] - 功能实现: 增加 H5 应用容器与基础 Layout 能力

- **文件**: `apps/web/src/services/app.service.ts`, `apps/web/src/views/admin/AppsView.vue`, `apps/web/src/views/admin/AppDetailView.vue`, `apps/web/src/router/index.ts`, `apps/web/src/types/api.ts`, `apps/web/supabase/migrations/0011_h5_apps.sql`, `packages/visual-editor/src/types/visual-editor.ts`, `packages/visual-editor/src/views/preview/index.vue`, `packages/visual-ui/src/components/visual-tabbar/*`, `packages/visual-ui/src/components/visual-app-layout/*`
- **决策**: 应用作为页面容器；创建应用默认生成首页、个人中心、商品详情、文章详情模板；应用级 Layout 使用底部 TabBar 配置。
- **验证**: `pnpm type-check` 通过；`pnpm --filter @visual/editor type-check` 通过；`pnpm test` 通过（7/7）；`pnpm build` 被既有 Pinia 链 `vue-demi` 缺失阻断。

## [当前] - Bug 修复: 补齐应用管理侧边栏入口

- **文件**: `apps/web/src/layout/AdminLayout.vue`
- **决策**: 在页面管理菜单后增加 `/admin/apps` 应用管理入口。
- **验证**: `pnpm --filter @visual/web type-check` 通过。

## [当前] - Bug 修复: 应用 slug 约束提交失败

- **文件**: `apps/web/src/services/app.service.ts`, `apps/web/src/views/admin/AppsView.vue`
- **决策**: 创建应用前统一规范化并校验 slug，拒绝中文、空值及不符合小写字母/数字/连字符规则的标识。
- **验证**: `pnpm --filter @visual/web type-check` 通过。

## [当前] - Bug 修复: 应用编辑设置克隆响应式对象失败

- **文件**: `apps/web/src/views/admin/AppsView.vue`
- **决策**: 用 JSON 深拷贝 Supabase 返回的应用数据，避免对 Vue Proxy 使用 `structuredClone` 触发 `DataCloneError`。
- **验证**: `pnpm --filter @visual/web type-check` 通过。

## [当前] - 功能优化: 应用列表与应用导航设置交互

- **文件**: `apps/web/src/views/admin/AppsView.vue`, `apps/web/src/views/admin/AppDetailView.vue`
- **决策**: 应用卡片采用页面管理同款更多操作菜单；“管理应用”明确为“页面管理”；应用详情页直接编辑底部导航并支持添加、移除、目标页面和样式配置。
- **验证**: `pnpm --filter @visual/web type-check` 通过。

## [当前] - 功能实现: 增加应用发布与首页预览入口

- **文件**: `apps/web/src/services/app.service.ts`, `apps/web/src/views/admin/AppsView.vue`
- **决策**: 应用发布先发布应用内草稿页面，再更新应用状态；预览应用打开应用首页，未发布时打开草稿预览。
- **验证**: `pnpm --filter @visual/web type-check` 通过。
