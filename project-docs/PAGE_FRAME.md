# 页面结构

状态：Confirmed（首发核心范围）

| 页面 | 访问 | 关键状态 |
| --- | --- | --- |
| 登录 | `/login` | 登录失败、注册成功、session 过期 |
| 工作台 | `/admin/dashboard` | 统计、最近页面、错误提示 |
| 页面管理 | `/admin/pages` | 草稿/已发布、编辑、预览、删除 |
| 编辑器 | `/editor/:pageId` | 保存状态、发布、版本、回滚 |
| 公开页面 | `/p/:slug` | 加载中、已发布、空页面、未找到、异常 |
| 内容后台 | `/admin/products`、`/admin/articles` | 搜索、筛选、批量状态 |
