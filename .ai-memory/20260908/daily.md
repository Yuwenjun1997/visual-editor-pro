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
