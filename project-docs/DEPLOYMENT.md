# 部署与上线检查

## 环境变量

在 `apps/web/.env.local` 或生产平台配置：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

只使用 publishable/anon key。数据库 service role key 不得进入前端环境变量或仓库。

## Supabase migration

按 `apps/web/supabase/README.md` 中列出的顺序执行 `apps/web/supabase/migrations`。执行完成后检查：

- `save_draft_page`
- `publish_page`
- `rollback_page`
- `get_published_page_by_slug`
- `resolve_public_data_source`

然后运行 Security Advisor、Performance Advisor，并使用匿名客户端验证草稿不可见、已发布页面可见。

## 构建与发布

```bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

静态站点需要配置 SPA fallback，使 `/login`、`/admin/*`、`/editor/*` 和 `/p/*` 都回退到 `index.html`。生产环境更新前先执行数据库 migration，再发布前端资源。

## 回滚

前端回滚使用上一份构建产物；页面内容回滚使用编辑器版本面板中的 revision 回滚。不要删除 `page_revisions` 历史记录。
