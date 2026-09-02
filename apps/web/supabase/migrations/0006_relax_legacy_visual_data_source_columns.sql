-- 新数据源模型不再写入旧版 column_key/component_key/data_type/data 字段。
-- 旧字段保留用于读取兼容，但不能继续阻塞新数据源插入。
alter table if exists public.visual_data_sources
  alter column column_key drop not null,
  alter column component_key drop not null,
  alter column data_type drop not null,
  alter column data drop not null;

notify pgrst, 'reload schema';
