-- 统一 RPC 命名：域_动作_资源_场景。
-- 本迁移仅保留规范名称；仓内所有调用必须与本迁移同批发布。

alter function public.handle_new_user() rename to auth_create_profile_on_user_insert;
alter function public.list_users() rename to admin_read_users;
alter function public.set_user_role(uuid, text) rename to admin_write_user_role;

alter function public.save_draft_page(uuid, text, text, jsonb, jsonb) rename to page_write_draft;
alter function public.publish_page(uuid) rename to page_write_publish;
alter function public.rollback_page(uuid, uuid) rename to page_write_restore_published_revision;
alter function public.create_page_preview_token(uuid, jsonb) rename to page_write_preview_token;

alter function public.get_published_page_by_slug(text) rename to page_read_published_by_slug;
alter function public.get_preview_page_by_token(text) rename to page_read_preview_by_token;
alter function public.resolve_published_page_data_source(uuid, uuid) rename to page_read_published_data_source;
alter function public.resolve_preview_page_data_source(text, uuid) rename to page_read_preview_data_source;

alter function public.resolve_public_data_source(uuid) rename to data_source_read_public;

alter function public.publish_app(uuid) rename to app_write_publish;
alter function public.get_published_app_route(text, text) rename to app_read_published_route;
alter function public.get_published_app_config(text) rename to app_read_published_config;
alter function public.get_published_app_product(text, uuid) rename to app_read_published_product;
alter function public.get_published_app_article(text, uuid) rename to app_read_published_article;
alter function public.get_preview_app_product(text, uuid) rename to app_read_preview_product;
alter function public.get_preview_app_article(text, uuid) rename to app_read_preview_article;

alter function public.get_editor_preview_detail(text, uuid) rename to editor_read_preview_detail;
alter function public.resolve_editor_preview_data_source(uuid) rename to editor_read_preview_data_source;

-- 0004 的保存 RPC 已被 page_write_draft 完整替代；0014 的回滚 RPC 已被 0015 废弃。
drop function if exists public.save_page_with_data_source_bindings(uuid, text, jsonb, jsonb);
drop function if exists public.rollback_app(uuid, uuid);

-- PL/pgSQL 函数中的名称在运行时解析，重建两个委托函数以引用规范名称。
create or replace function public.page_read_published_data_source(p_page_id uuid, p_source_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.page_data_source_bindings b
    join public.pages p on p.id = b.page_id
    join public.apps a on a.id = p.app_id
    where b.page_id = p_page_id
      and b.source_id = p_source_id
      and p.status = 'published'
      and p.published_revision_id is not null
      and a.status = 'published'
  ) then
    return null;
  end if;
  return public.data_source_read_public(p_source_id);
end;
$$;

create or replace function public.page_read_preview_data_source(p_token text, p_source_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare preview_page_id uuid;
begin
  select page_id into preview_page_id
  from public.page_preview_tokens
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and expires_at > now();

  if preview_page_id is null
    or not exists (
      select 1 from public.page_data_source_bindings
      where page_id = preview_page_id and source_id = p_source_id
    ) then
    return null;
  end if;
  return public.data_source_read_public(p_source_id);
end;
$$;

-- 所有 definer/invoker function 使用受限 search_path；查询表均显式限定 public/auth/extensions。
alter function public.auth_create_profile_on_user_insert() set search_path to '';
alter function public.admin_read_users() set search_path to '';
alter function public.admin_write_user_role(uuid, text) set search_path to '';
alter function public.page_write_draft(uuid, text, text, jsonb, jsonb) set search_path to '';
alter function public.page_write_publish(uuid) set search_path to '';
alter function public.page_write_restore_published_revision(uuid, uuid) set search_path to '';
alter function public.page_write_preview_token(uuid, jsonb) set search_path to '';
alter function public.page_read_published_by_slug(text) set search_path to '';
alter function public.page_read_preview_by_token(text) set search_path to '';
alter function public.data_source_read_public(uuid) set search_path to '';
alter function public.app_write_publish(uuid) set search_path to '';
alter function public.app_read_published_route(text, text) set search_path to '';
alter function public.app_read_published_config(text) set search_path to '';
alter function public.app_read_published_product(text, uuid) set search_path to '';
alter function public.app_read_published_article(text, uuid) set search_path to '';
alter function public.app_read_preview_product(text, uuid) set search_path to '';
alter function public.app_read_preview_article(text, uuid) set search_path to '';
alter function public.editor_read_preview_detail(text, uuid) set search_path to '';
alter function public.editor_read_preview_data_source(uuid) set search_path to '';

revoke all on function public.auth_create_profile_on_user_insert() from public, anon, authenticated;
revoke all on function public.admin_read_users() from public, anon;
revoke all on function public.admin_write_user_role(uuid, text) from public, anon;
revoke all on function public.page_write_draft(uuid, text, text, jsonb, jsonb) from public, anon;
revoke all on function public.page_write_publish(uuid) from public, anon;
revoke all on function public.page_write_restore_published_revision(uuid, uuid) from public, anon;
revoke all on function public.page_write_preview_token(uuid, jsonb) from public, anon;
revoke all on function public.data_source_read_public(uuid) from public, anon, authenticated;
revoke all on function public.app_write_publish(uuid) from public, anon;
revoke all on function public.editor_read_preview_detail(text, uuid) from public, anon;
revoke all on function public.editor_read_preview_data_source(uuid) from public, anon;

revoke all on function public.page_read_published_by_slug(text) from public;
revoke all on function public.page_read_preview_by_token(text) from public;
revoke all on function public.page_read_published_data_source(uuid, uuid) from public;
revoke all on function public.page_read_preview_data_source(text, uuid) from public;
revoke all on function public.app_read_published_route(text, text) from public;
revoke all on function public.app_read_published_config(text) from public;
revoke all on function public.app_read_published_product(text, uuid) from public;
revoke all on function public.app_read_published_article(text, uuid) from public;
revoke all on function public.app_read_preview_product(text, uuid) from public;
revoke all on function public.app_read_preview_article(text, uuid) from public;

grant execute on function public.admin_read_users() to authenticated;
grant execute on function public.admin_write_user_role(uuid, text) to authenticated;
grant execute on function public.page_write_draft(uuid, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.page_write_publish(uuid) to authenticated;
grant execute on function public.page_write_restore_published_revision(uuid, uuid) to authenticated;
grant execute on function public.page_write_preview_token(uuid, jsonb) to authenticated;
grant execute on function public.app_write_publish(uuid) to authenticated;
grant execute on function public.editor_read_preview_detail(text, uuid) to authenticated;
grant execute on function public.editor_read_preview_data_source(uuid) to authenticated;

grant execute on function public.page_read_published_by_slug(text) to anon, authenticated;
grant execute on function public.page_read_preview_by_token(text) to anon, authenticated;
grant execute on function public.page_read_published_data_source(uuid, uuid) to anon, authenticated;
grant execute on function public.page_read_preview_data_source(text, uuid) to anon, authenticated;
grant execute on function public.app_read_published_route(text, text) to anon, authenticated;
grant execute on function public.app_read_published_config(text) to anon, authenticated;
grant execute on function public.app_read_published_product(text, uuid) to anon, authenticated;
grant execute on function public.app_read_published_article(text, uuid) to anon, authenticated;
grant execute on function public.app_read_preview_product(text, uuid) to anon, authenticated;
grant execute on function public.app_read_preview_article(text, uuid) to anon, authenticated;
