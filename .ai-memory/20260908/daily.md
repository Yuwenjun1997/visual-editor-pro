## [12:15] - Bug 修复: 稳定 iframe 舞台与宿主的快速选中同步

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`、`stage-selection-sync.ts`、`stage-selection-sync.test.ts`
- **决策**: 舞台端以最新本地选择为准，忽略宿主较早的确认回传；宿主同步触发的选中变化不再反向发送，并拒绝旧 revision 状态。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test -- --reporter=verbose` 通过（35/35）。

## [12:24] - Bug 修复: 将舞台组件选择前移到指针捕获阶段

- **文件**: `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`
- **决策**: 在 iframe document 的捕获阶段解析命中的 `.visual-block`，立即更新本地选中并发送请求，避免被子组件或拖拽库的冒泡事件处理吞掉。
- **验证**: `pnpm --filter @visual/editor type-check` 通过；`pnpm --filter @visual/editor test -- --reporter=verbose` 通过（35/35）。
