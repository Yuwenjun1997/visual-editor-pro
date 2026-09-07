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
