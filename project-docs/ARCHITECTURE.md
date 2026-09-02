# 系统架构

状态：Confirmed（首发核心范围）

## 分层

- `apps/web`：路由、Supabase 客户端、后台页面和发布交互。
- `packages/visual-editor`：编辑器、预览渲染和 schema 类型。
- `packages/visual-ui`：可独立复用的渲染组件库。
- Supabase：Auth、Postgres、RLS、事务 RPC 和 Storage。

## 发布数据流

编辑器 → `save_draft_page` 保存草稿与数据源绑定 → `publish_page` 生成不可变 `page_revisions` → `/p/:slug` 调用 `get_published_page_by_slug` → 组件数据通过 `resolve_public_data_source` 白名单读取。

## 安全边界

后台表按 `user_id` 使用 RLS 隔离；公开页面只通过受限 RPC 返回已发布 schema 和已发布内容；公开 RPC 不返回用户标识、草稿或原始业务表行。
