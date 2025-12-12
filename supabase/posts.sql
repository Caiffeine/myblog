-- Create posts table matching the app's mock structure
create table if not exists public.posts (
  id bigint primary key,           -- WordPress post ID (not auto-generated)
  title jsonb not null,            -- { rendered: string }
  excerpt jsonb not null,          -- { rendered: string }
  content jsonb null,              -- { rendered: string } - full post content
  date text not null,              -- ISO date string
  featured_media text null,        -- optional URL
  slug text unique null
);

-- Enable RLS and allow public read if desired
alter table public.posts enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'posts' and policyname = 'Public read posts'
  ) then
    create policy "Public read posts"
    on public.posts
    for select
    to anon
    using (true);
  end if;
end $$;
