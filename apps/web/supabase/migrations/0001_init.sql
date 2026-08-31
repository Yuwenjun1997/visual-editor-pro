-- 0001_init.sql
-- visual-editor-pro:supabase 初始表 + RLS + Storage
-- 在 Supabase 控制台 SQL Editor 执行(或通过 CLI supabase db push)

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- profiles(可选,UI 当前只依赖 auth.users;注册触发器自动建行)
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- categories 分类(product / article)
-- --------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  "type" text not null check ("type" in ('product', 'article')),
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_categories_user on public.categories (user_id);
create index if not exists idx_categories_type on public.categories ("type");

-- --------------------------------------------------------------------------
-- products 商品
-- --------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  cover_url text,
  price numeric(10, 2),
  origin_price numeric(10, 2),
  tag text,
  buy_link text,
  status text not null default 'published' check (status in ('published', 'draft', 'off')),
  sort int not null default 0,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_user on public.products (user_id);
create index if not exists idx_products_category on public.products (category_id);

-- --------------------------------------------------------------------------
-- articles 文章(content 存 { html: string })
-- --------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  cover_url text,
  summary text,
  content jsonb not null default '{}'::jsonb,
  author_name text,
  publish_time timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_articles_user on public.articles (user_id);
create index if not exists idx_articles_category on public.articles (category_id);

-- --------------------------------------------------------------------------
-- pages 页面(schema 存整页 JSON:schema = { pageId,title,themeName,globalStyle,blocks })
-- --------------------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_pages_user on public.pages (user_id);

-- --------------------------------------------------------------------------
-- RLS(每用户隔离)
-- --------------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.articles   enable row level security;
alter table public.pages      enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array['categories', 'products', 'articles', 'pages'] loop
    execute format(
      'create policy "%1$s_all_own" on public.%1$s for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t
    );
  end loop;
end $$;

-- --------------------------------------------------------------------------
-- 注册时自动建 profiles 行(可选)
-- --------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------------
-- Storage:covers 公共桶(读公开,写仅本人 <user_id>/<file>)
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "covers_select_public" on storage.objects
  for select using (bucket_id = 'covers');

create policy "covers_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "covers_update_own" on storage.objects
  for update using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "covers_delete_own" on storage.objects
  for delete using (
    bucket_id = 'covers'
    and auth.uid()::text = (storage.foldername(name))[1]
  );