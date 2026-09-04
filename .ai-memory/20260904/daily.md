## [11:24] - 功能实现: 全局页面管理仅显示独立页面

- **文件**: apps/web/src/services/page.service.ts
- **决策**: 以 `pages.app_id is null` 区分独立页面；带应用归属的页面仅通过应用详情中的页面管理查询。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [13:52] - 功能实现: 应用状态收敛与快照恢复

- **文件**: apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue; apps/web/src/services/app.service.ts; apps/web/src/types/api.ts; apps/web/supabase/migrations/0015_app_snapshots_and_publish_state.sql
- **决策**: 应用预览使用 `/apps/{slug}`；应用修改保持实时写入并标记待发布；移除应用版本历史入口，新增可多次创建并恢复的应用快照；发布状态沿用 published/draft/offline（界面显示已发布/待发布/已下线）。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。需执行 0015 migration 后联调快照与发布流程。

## [14:18] - Bug修复: 应用页面修改实时生效

- **文件**: apps/web/src/main.ts; apps/web/src/services/app.service.ts; apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue; apps/web/supabase/migrations/0015_app_snapshots_and_publish_state.sql; apps/web/supabase/migrations/0016_realtime_app_page_content.sql
- **决策**: `/apps/{slug}` 路由改为读取 `pages.schema` 当前内容，不再读取页面发布快照；应用和页面编辑不再自动切换为待发布，新增页面也可立即通过应用路由访问。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。需执行 0016 migration 后验证已发布应用页面修改的公开访问结果。

## [14:36] - 功能实现: 应用内新建页面默认已发布

- **文件**: apps/web/src/services/app.service.ts
- **决策**: `createCustomPage` 插入页面时显式设置 `status: 'published'`，与应用页面管理的即时生效规则一致。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [13:15] - 功能实现: 应用公开预览与版本回退

- **文件**: apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue; apps/web/src/services/app.service.ts; apps/web/src/main.ts; apps/web/src/types/api.ts; apps/web/supabase/migrations/0014_app_revision_rollback.sql
- **决策**: 应用预览统一使用 `/apps/{slug}`；应用配置修改标记为草稿；新增应用版本列表与回退 RPC，页面预览继续使用 `/_preview/{token}`。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。需执行 0014 迁移后联调发布/回退流程。

## [12:48] - Bug修复: 应用预览展示草稿导航配置

- **文件**: apps/web/src/views/admin/AppsView.vue
- **决策**: 应用预览统一通过首页预览令牌读取当前草稿配置，避免已发布应用直接跳线上快照而隐藏新保存的自定义 TabBar 项。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [12:35] - Bug修复: 修复应用发布快照写入权限

- **文件**: apps/web/supabase/migrations/0013_allow_app_revision_publish.sql
- **决策**: 为 `app_revisions` 增加 authenticated 用户的 INSERT 权限及 `user_id/created_by` 归属校验，保持最小权限。
- **验证**: 静态核对迁移策略与 `publish_app` 写入字段；`git diff --check` 通过。需在目标 Supabase 环境执行迁移后联调发布流程。

## [12:22] - Bug修复: 修复应用页面排序值整数溢出

- **文件**: apps/web/src/services/app.service.ts
- **决策**: 新建应用页面前读取该应用当前最大 `sort`，以最大值加 1 生成排序值，避免将 `Date.now()` 写入 integer 字段。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [12:08] - 功能实现: 商品/文章详情预览改为列表选择

- **文件**: apps/web/src/views/admin/AppDetailView.vue
- **决策**: 详情预览先加载最近更新的已发布商品或文章各 5 条，通过选择弹窗传入所选实体 ID；取消手输 UUID。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [11:52] - Bug修复: 避免预览窗口停留在 about:blank

- **文件**: apps/web/src/views/admin/PagesView.vue; apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue
- **决策**: 在点击事件同步阶段先打开空白窗口，再异步获取预览地址并设置 `location.href`；令牌失败时关闭窗口。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [11:31] - Bug修复: 修复独立页面预览链接无效

- **文件**: apps/web/supabase/migrations/0012_preview_standalone_pages.sql
- **决策**: 预览 RPC 对 `apps` 使用左连接；独立页面返回最小预览应用配置，应用页面保持原有应用配置。
- **验证**: `pnpm --filter @visual/web type-check` 通过；H5 `nuxt typecheck` 因本机 Nuxt 二进制 EPERM 未能执行；`git diff --check` 通过。

## [11:42] - Bug修复: 修正预览窗口拦截提示误判

- **文件**: apps/web/src/views/admin/PagesView.vue; apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue
- **决策**: 移除 `window.open` 的 `noopener,noreferrer` features，成功打开后显式设置 `popup.opener = null`，避免浏览器返回空句柄导致误提示。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [13:44] - 功能实现: 应用设置改为独立页面

- **文件**: apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppSettingsView.vue; apps/web/src/router/index.ts
- **决策**: 应用列表的“应用设置”入口跳转到 `/admin/apps/:appId/settings`，保留原有配置字段、保存逻辑与权限校验，取消弹窗交互。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。Prettier/ESLint 因当前环境命令解析与 pnpm 链接依赖读取 EPERM 未执行成功。

## [13:50] - 功能实现: 应用卡片操作分层

- **文件**: apps/web/src/views/admin/AppsView.vue; apps/web/src/views/admin/AppDetailView.vue
- **决策**: 将应用设置、页面管理、预览应用提升到卡片外部操作区；更多菜单移除重复项并新增快照管理，使用查询参数进入应用详情后自动打开快照面板。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [13:56] - 界面调整: 更多操作移至卡片右上角

- **文件**: apps/web/src/views/admin/AppsView.vue
- **决策**: 将带 `ep:more-filled` 图标的 `el-dropdown` 移入应用卡片顶部信息行右侧，底部保留三个主要操作按钮。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [14:06] - 功能整理: 应用高级配置集中到设置页

- **文件**: apps/web/src/views/admin/AppSettingsView.vue; apps/web/src/views/admin/AppDetailView.vue; apps/web/src/views/admin/AppsView.vue
- **决策**: 将底部导航配置和应用快照入口及逻辑迁移到应用设置页；应用详情页不再展示或承载这两项功能，快照管理路由改为设置页并自动打开快照面板。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。

## [14:20] - 重构: 去除应用设置配置重复项

- **文件**: apps/web/src/views/admin/AppSettingsView.vue
- **决策**: 基础配置仅保留应用名称和首页 RouteKey；显示底部导航、导航颜色和导航项目统一由底部导航配置维护，基础配置保存不再提交 layout_config。
- **验证**: `pnpm --filter @visual/web type-check` 通过；`git diff --check` 通过。
