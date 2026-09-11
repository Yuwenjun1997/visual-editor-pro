create table if not exists public.image_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.image_categories(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.image_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.image_categories(id) on delete set null,
  storage_path text not null unique,
  thumbnail_path text,
  name text not null check (char_length(btrim(name)) between 1 and 255),
  mime_type text not null,
  size integer not null check (size >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_image_categories_user_parent on public.image_categories(user_id, parent_id, sort);
create index if not exists idx_image_assets_user_category_created on public.image_assets(user_id, category_id, created_at desc);

create or replace function public.enforce_image_category_depth()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.parent_id is not null and exists (select 1 from public.image_categories parent where parent.id = new.parent_id and parent.parent_id is not null) then
    raise exception '图片分类最多支持两级';
  end if;
  if new.parent_id is not null and not exists (select 1 from public.image_categories parent where parent.id = new.parent_id and parent.user_id = new.user_id) then
    raise exception '父分类无效';
  end if;
  return new;
end;
$$;
create trigger image_categories_depth before insert or update of parent_id, user_id on public.image_categories
for each row execute function public.enforce_image_category_depth();

create or replace function public.enforce_image_asset_category_owner()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.category_id is not null and not exists (
    select 1 from public.image_categories category where category.id = new.category_id and category.user_id = new.user_id
  ) then
    raise exception '图片分类无效';
  end if;
  return new;
end;
$$;
create trigger image_assets_category_owner before insert or update of category_id, user_id on public.image_assets
for each row execute function public.enforce_image_asset_category_owner();

alter table public.image_categories enable row level security;
alter table public.image_assets enable row level security;
create policy "image_categories_own" on public.image_categories for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "image_assets_own" on public.image_assets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

insert into public.image_assets(user_id, storage_path, name, mime_type, size, created_at, updated_at)
select split_part(o.name, '/', 1)::uuid, o.name, regexp_replace(o.name, '^.*/', ''), coalesce(o.metadata->>'mimetype', 'image/*'), coalesce((o.metadata->>'size')::integer, 0), o.created_at, o.updated_at
from storage.objects o
where o.bucket_id = 'covers' and o.name ~ '^[0-9a-fA-F-]{36}/'
on conflict (storage_path) do nothing;
