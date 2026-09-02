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

## [当前] - 功能实现: 统一组件 schema 与静态数据源配置

- **文件**: `packages/visual-editor/src/schemas/modules/*`, `packages/visual-editor/src/schemas/index.ts`, `packages/visual-editor/src/types/visual-editor.ts`, `packages/visual-editor/src/hooks/useSchema.ts`, `packages/visual-editor/src/components/visual-control/visual-source-data-editor/`, `apps/web/src/views/admin/DataSourcesView.vue`, `apps/web/src/services/data-source.service.ts`
- **决策**: 移除 `catalog.ts`，组件 schema 独立模块化并增加 object/list 元数据；对象数组递归聚合子组件 schema；管理页静态源改为 schema 选择与表格编辑，旧 manual 契约保留兼容模式。
- **验证**: `pnpm type-check` 通过；`pnpm build` 通过；`git diff --check` 通过。

## [当前] - 配置变更: 修复远端旧版数据源表缺少 data_contract

- **文件**: `apps/web/supabase/migrations/0005_reconcile_visual_data_sources.sql`, `apps/web/supabase/README.md`
- **决策**: 远端 `visual-design` 项目仍为旧表结构且迁移记录为空，新增幂等兼容迁移并保留旧数据映射为 `manual-object/manual-list`。
- **验证**: 已应用 Supabase 迁移；远端表已出现 `data_contract/source_kind/query_config/manual_data/status/schema_version`；SQL 查询返回 2 条旧数据源；迁移记录为 `reconcile_visual_data_sources`。

## [当前] - 配置变更: 放宽旧数据源字段约束

- **文件**: `apps/web/supabase/migrations/0006_relax_legacy_visual_data_source_columns.sql`, `apps/web/supabase/README.md`
- **决策**: 旧版 `column_key/component_key/data_type/data` 保留读取兼容，但改为可空，避免新模型插入时触发非空约束。
- **验证**: 已应用 Supabase 迁移；远端四个旧字段均确认 `is_nullable=YES`。

## [当前] - 功能修复: 补齐数据模块类型并统一 URL 新窗口跳转

- **文件**: `packages/visual-editor/src/packages/modules/visual-comment.ts`, `visual-form.ts`, `visual-map.ts`, `visual-picture-wrap.ts`, `visual-tabs.ts`, `visual-timeline.ts`; `packages/visual-ui/src/components/visual-button/visual-button.vue`, `visual-customer-service/visual-customer-service.vue`, `visual-event-container/visual-event-container.vue`, `visual-flash-sale/visual-flash-sale.vue`, `visual-float-action/visual-float-action.vue`, `visual-form/visual-form.vue`, `visual-popup/visual-popup.vue`, `visual-poster/visual-poster.vue`, `visual-product-item/visual-product-item.vue`, `visual-search/visual-search.vue`
- **决策**: 所有消费 `listData` 的编辑器模块声明 `souceDataType: 'VisualObjectArray'`；组件锚点统一使用 `_blank`、`noopener noreferrer`，脚本跳转统一使用 `window.open`。
- **验证**: `pnpm type-check` 通过（3 个 workspace 包）；`git diff --check` 通过。

## [当前] - 回归修复: 补齐普通对象型模块 souceDataType

- **文件**: `packages/visual-editor/src/packages/modules/` 下 20 个普通组件模块
- **决策**: 为未声明类型且非数据容器的模块补充 `souceDataType: 'VisualObject'`；已有列表数据模块保留 `VisualObjectArray`，数据容器模块不互相嵌套。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。

## [当前] - Bug 修复: 修复数据源配置弹窗切换空白与绑定回显失效

- **文件**: `packages/visual-editor/src/components/visual-control/visual-source-data-editor/visual-source-data-editor.vue`
- **决策**: Tab 使用独立的 `activeTab`，将新模型的 `managed` 与旧页面的 `column` 统一映射到“数据源”页，避免 `el-tabs` 因无对应 pane 渲染空白；选中数据源继续保存为 `managed`。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。未执行浏览器交互回归。

## [15:32] - 功能修复: 自定义数据按 souceDataType 使用组件 schema

- **文件**: `packages/visual-editor/src/hooks/useSchema.ts`
- **决策**: 当当前组件 schema 的 `dataType` 与 `souceDataType` 匹配且包含字段时优先使用自身 schema；通用容器继续回退到插槽组件 schema 聚合。
- **验证**: `pnpm --filter @visual/editor type-check` 通过。

## [15:35] - Bug 修复: 补齐对象数组容器的数据类型声明

- **文件**: `packages/visual-editor/src/packages/modules/visual-object-array.ts`
- **决策**: 为 `VisualObjectArray` 编辑器元数据补充 `souceDataType: 'VisualObjectArray'`，避免打开自定义数据时按默认对象渲染。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。

## [当前] - 功能修复: 移除容器子组件时清空父级数据源

- **文件**: `packages/visual-editor/src/hooks/useBlocks.ts`, `packages/visual-editor/src/components/visual-blocks/visual-blocks.vue`
- **决策**: 删除操作记录父组件；当父组件为 `VisualObject` 或 `VisualObjectArray` 时，将数据源重置为 custom 并清理 sourceId、栏目字段及自定义 JSON。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。

## [当前] - 功能修复: 拖拽移出容器时清空父级数据源

- **文件**: `packages/visual-editor/src/hooks/useBlocks.ts`, `packages/visual-editor/src/components/visual-blocks/visual-blocks.vue`
- **决策**: 监听 vuedraggable 的 `change.removed` 事件，覆盖将子组件拖出 `VisualObject` / `VisualObjectArray` 的移除场景。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`git diff --check` 通过。
