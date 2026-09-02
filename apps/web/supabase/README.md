# Supabase 迁移与回归说明

按 `0001_init.sql` → `0002_rbac.sql` → `0003_visual_data_sources.sql` → `0004_page_data_source_bindings.sql` 顺序执行。

Wave 4 的页面保存必须调用 `save_page_with_data_source_bindings`；该函数在同一事务中更新 `pages` 与 `page_data_source_bindings`。数据源删除使用 `ON DELETE RESTRICT`，应用层应先查询绑定并展示受影响页面。

Wave 5 的旧业务引用迁移规则：

- `products/category` → `product-list + categoryId`
- `products/ids` → `product-list + entityIds`
- `articles/category` → `article-list + categoryId`
- `articles/ids` → `article-list + entityIds`
- `all` → 对应实体集合的空筛选

业务集合规则有唯一索引，重复迁移会复用同一来源；页面只写入 `managed/sourceId`，不会把业务明细写回 schema。

## 建议回归检查

1. 两个页面绑定同一 `sourceId`，修改商品价格后重新加载两个页面。
2. 用两个用户分别创建来源，确认列表、绑定和删除互不可见。
3. 删除被引用来源，确认应用层展示页面列表且数据库外键拒绝删除。
4. 重复加载/保存含旧 `businessDataRef` 的页面，确认只生成一个集合数据源。
