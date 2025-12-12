-- Create comments table for posts
create table if not exists public.comments_tbl (
  id bigint primary key generated always as identity,
  post_id bigint not null,
  userName text not null,
  userComment text not null,
  created_at timestamptz not null default now(),
  constraint fk_comments_post
    foreign key (post_id)
    references public.posts(id)
    on delete cascade
);

-- Enable RLS
alter table public.comments_tbl enable row level security;

-- Allow public read of comments
create policy "Public read comments"
on public.comments_tbl
for select
to anon
using (true);

-- Allow public insert of comments
create policy "Public insert comments"
on public.comments_tbl
for insert
to anon
with check (true);

-- Optional: allow deleting own comments if you later add auth; for now, disable deletes/updates via anon
-- You can add stricter checks or move to auth users later.
