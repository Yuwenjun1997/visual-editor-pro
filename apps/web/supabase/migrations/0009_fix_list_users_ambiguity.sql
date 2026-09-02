-- 修复 list_users/set_user_role 中未限定的列名与 PL/pgSQL 变量冲突。

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
    select 1 from public.profiles as caller_profile
    where caller_profile.id = auth.uid() and caller_profile.role = 'admin'
  ) then
    raise exception 'privilege: admins only';
  end if;

  return query
    select u.id, u.email::text, p.full_name, p.avatar_url, p.role, p.created_at
    from auth.users as u
    inner join public.profiles as p on p.id = u.id
    order by p.created_at desc;
end;
$$;

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
    select 1 from public.profiles as caller_profile
    where caller_profile.id = auth.uid() and caller_profile.role = 'admin'
  ) then
    raise exception 'privilege: admins only';
  end if;

  if new_role not in ('admin', 'editor', 'viewer') then
    raise exception 'invalid role: %', new_role;
  end if;
  if target_user_id = auth.uid() then
    raise exception 'cannot change your own role';
  end if;

  select target_profile.role into current_role
  from public.profiles as target_profile
  where target_profile.id = target_user_id;
  if current_role is null then
    raise exception 'target profile not found';
  end if;

  if current_role = 'admin' and new_role <> 'admin' then
    select count(*) into admins
    from public.profiles as admin_profile
    where admin_profile.role = 'admin';
    if admins <= 1 then
      raise exception 'cannot demote the last admin';
    end if;
  end if;

  update public.profiles
  set role = new_role, updated_at = now()
  where public.profiles.id = target_user_id;
end;
$$;

revoke all on function public.list_users() from anon, public;
revoke all on function public.set_user_role(uuid, text) from anon, public;
grant execute on function public.list_users() to authenticated;
grant execute on function public.set_user_role(uuid, text) to authenticated;
