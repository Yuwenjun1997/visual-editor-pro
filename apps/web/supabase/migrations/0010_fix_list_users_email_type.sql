-- auth.users.email 为 varchar(255)，显式转换以匹配 list_users() 的 text 返回列。

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

revoke all on function public.list_users() from anon, public;
grant execute on function public.list_users() to authenticated;
