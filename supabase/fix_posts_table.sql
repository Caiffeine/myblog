-- Drop and recreate posts table to allow WordPress IDs
drop table if exists public.posts cascade;

create table public.posts (
  id bigint primary key,  -- WordPress post ID
  title jsonb not null,
  excerpt jsonb not null,
  date text not null,
  featured_media text null,
  slug text unique null
);

-- Enable RLS and allow public read
alter table public.posts enable row level security;

create policy "Public read posts"
on public.posts
for select
to anon
using (true);
