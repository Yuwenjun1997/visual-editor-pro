-- 0002_rbac.sql
-- visual-editor-pro:RBAC 角色列 + 管理员专用 RPC
-- 在 Supabase 控制台 SQL Editor 执行(或 CLI supabase db push)

-- --------------------------------------------------------------------------
-- 1) profiles 增加 role 列(新注册默认 viewer,最小权限,由管理员在用户管理页提升)
-- --------------------------------------------------------------------------
alter table public.profiles
  add column if not exists role text not null default 'viewer'
  check (role in ('admin', 'editor', 'viewer'));

-- --------------------------------------------------------------------------
-- 2) 注册触发器:显式携带默认角色 + 注册元数据(full_name/avatar_url 来自 raw_user_meta_data)
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    'viewer'
  );
  return new;
end;
$$;

-- --------------------------------------------------------------------------
-- 3) 管理员 RPC:list_users()
--    RLS 下普通客户端互不可见他人行,故用 security definer(owner 豁免 RLS)
--    仅当调用者自身 role='admin' 才返回全部用户(含 auth.users.email)
-- --------------------------------------------------------------------------
create or replace function public.list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  avatar_url text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'privilege: admins only';
  end if;

  return query
    select
      u.id,
      u.email,
      p.full_name,
      p.avatar_url,
      p.role,
      p.created_at
    from auth.users as u
    inner join public.profiles as p on p.id = u.id
    order by p.created_at desc;
end;
$$;

-- --------------------------------------------------------------------------
-- 4) 管理员 RPC:set_user_role(调整他人角色)
--    禁止改自己的角色;禁止降级最后一个 admin
-- --------------------------------------------------------------------------
create or replace function public.set_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_role text;
  admins int;
begin
  if not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'privilege: admins only';
  end if;

  if new_role not in ('admin', 'editor', 'viewer') then
    raise exception 'invalid role: %', new_role;
  end if;

  if target_user_id = auth.uid() then
    raise exception 'cannot change your own role';
  end if;

  select role into current_role from public.profiles where id = target_user_id;
  if current_role is null then
    raise exception 'target profile not found';
  end if;

  if current_role = 'admin' and new_role <> 'admin' then
    select count(*) into admins from public.profiles where role = 'admin';
    if admins <= 1 then
      raise exception 'cannot demote the last admin';
    end if;
  end if;

  update public.profiles
    set role = new_role, updated_at = now()
    where id = target_user_id;
end;
$$;

-- --------------------------------------------------------------------------
-- 5) 权限:仅 authenticated 可执行;明确收回匿名/公共执行权
-- --------------------------------------------------------------------------
revoke all on function public.list_users() from anon, public;
revoke all on function public.set_user_role(uuid, text) from anon, public;
grant execute on function public.list_users() to authenticated;
grant execute on function public.set_user_role(uuid, text) to authenticated;

-- --------------------------------------------------------------------------
-- 6) 已存在用户引导为 admin(引入 RBAC 前的存量账号视为可信管理员)
--    防止迁移后现有账号被默认降为 viewer 而失去管理/编辑权限。
--    后续新注册用户保持默认 viewer,由管理员在用户管理页提升。
-- --------------------------------------------------------------------------
update public.profiles set role = 'admin' where role = 'viewer';