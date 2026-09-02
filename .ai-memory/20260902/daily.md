## [00:00] - 功能实现: 商品与文章改为实时绑定数据源

- **文件**: `packages/visual-ui/src/types/index.ts`, `packages/visual-ui/src/components/visual-object/visual-object.vue`, `packages/visual-ui/src/components/visual-object-array/visual-object-array.vue`, `packages/visual-editor/src/utils/visual.business-data.ts`, `packages/visual-editor/src/components/visual-blocks/components/use-component.vue`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/visual-source-data-editor.vue`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/components/visual-business-data/visual-business-data.vue`, `packages/visual-editor/src/schemas/modules/visual-product-list.ts`, `packages/visual-editor/src/schemas/modules/visual-product-card-list.ts`, `apps/web/src/services/business-data.service.ts`, `apps/web/src/main.ts`, `apps/web/src/views/PreviewBridgePage.vue`
- **决策**: 业务绑定 schema 仅保存商品/文章及全部/分类引用；渲染时通过宿主 provider 查询已发布记录，旧快照在加载时忽略、下次保存时迁移。
- **验证**: `pnpm type-check` 通过（3 个 workspace 包）。

## [13:06] - 功能调整: 隐藏编辑器中的接口请求数据源

- **文件**: `packages/visual-editor/src/components/visual-control/visual-source-data-editor/visual-source-data-editor.vue`
- **决策**: 从新建/编辑入口隐藏接口请求，保留已有 request 配置的运行时兼容逻辑，待后续安全模型完善后再恢复。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。

## [当前] - 配置变更: 完成 Wave 1 数据契约与数据源迁移草案

- **文件**: `packages/visual-editor/src/types/visual-editor.ts`, `packages/visual-ui/src/types/index.ts`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/components/visual-source-data-column.vue`, `apps/web/supabase/migrations/0003_visual_data_sources.sql`
- **决策**: 新模型以 `sourceKind/entityType/queryConfig/dataContract/manualData/status/schemaVersion` 为核心；旧 `columnKey/componentKey/data` 字段仅作过渡兼容。数据源表启用按用户 RLS、撤销匿名访问，并限制集合查询的字段、排序和数量。
- **验证**: `pnpm type-check` 通过（3 个 workspace 包）；`git diff --check` 通过；Supabase CLI 未安装，未执行本地数据库迁移。

## [当前] - 功能实现: 完成 Wave 2 商品/文章集合 provider

- **文件**: `apps/web/src/services/data-source.service.ts`, `packages/visual-editor/src/types/visual-editor.ts`, `packages/visual-editor/src/utils/visual.data-source.ts`, `packages/visual-editor/src/components/visual-blocks/components/use-component.vue`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/visual-source-data-editor.vue`
- **决策**: provider 按 `sourceId` 解析数据源并从 `products/articles` 查询最新已发布数据；商品支持分类、指定 ID、手动/最新/价格排序，文章支持分类、指定 ID、发布时间排序；渲染层只接收适配后的组件数据。
- **验证**: `pnpm type-check` 通过（3 个 workspace 包）；`git diff --check` 通过。未执行真实 Supabase 查询，需 CLI/项目连接后验证 RLS 与数据结果。

## [当前] - 功能实现: 完成 Wave 3 数据源管理与契约选择器

- **文件**: `apps/web/src/views/admin/DataSourcesView.vue`, `apps/web/src/services/data-source.service.ts`, `packages/visual-editor/src/types/visual-editor.ts`, `packages/visual-editor/src/hooks/useSourceDataEditor.ts`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/components/visual-source-data-column.vue`, `packages/visual-editor/src/packages/modules/visual-product-list.ts`, `packages/visual-editor/src/packages/modules/visual-product-card-list.ts`, `packages/visual-editor/src/packages/modules/visual-image-text-list.ts`, `packages/visual-editor/src/packages/modules/visual-image-text-card.ts`
- **决策**: 管理页按业务集合/静态数据配置；商品组件绑定 `product-list`，图文组件绑定 `article-list`；预览改为纯查询，不通过临时创建/删除数据源实现。
- **验证**: `pnpm type-check` 通过（3 个 workspace 包）；`git diff --check` 通过。未进行浏览器交互或真实 Supabase API 验证。

## [当前] - 功能实现: 合并完成 Wave 4/5/6 页面绑定、旧数据迁移与回归收口

- **文件**: `apps/web/supabase/migrations/0004_page_data_source_bindings.sql`, `apps/web/supabase/README.md`, `apps/web/src/services/page.service.ts`, `apps/web/src/services/data-source.service.ts`, `apps/web/src/services/business-data.service.ts`, `apps/web/src/main.ts`, `apps/web/src/views/PreviewBridgePage.vue`, `apps/web/src/views/admin/DataSourcesView.vue`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/components/visual-source-data-column.vue`
- **决策**: 页面保存统一调用事务 RPC 同步 schema 与 binding index；旧 businessDataRef 按规则去重并转换为 managed/sourceId；数据源删除由应用层影响提示 + 数据库外键 RESTRICT 双重保护。
- **验证**: `pnpm type-check` 通过；`pnpm build` 通过（3 个 workspace 包）；`git diff --check` 通过；绑定/RLS/迁移静态断言通过。未执行真实 Supabase SQL、RLS 双用户测试和浏览器交互回归。

## [当前] - 回归修复: 完善旧指定 ID 引用标准化

- **文件**: `apps/web/src/services/data-source.service.ts`
- **决策**: 旧 `businessDataRef.refType=ids` 在单值和数组两种形态下都统一为 `entityIds` 数组，保证重复迁移和查询语义一致。
- **验证**: `pnpm type-check` 通过；`git diff --check` 通过。
