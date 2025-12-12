# myblog

A modern, minimal blog built with React, Vite, Tailwind CSS, and Framer Motion.

## Supabase Integration

This project can optionally use Supabase Postgres to store and fetch posts. If Supabase is not configured, the app falls back to local mock data.

### 1) Create a Supabase project
- Create a project in Supabase.
- In Project Settings → Database, reset the password if needed (see your connection string screenshot).

### 2) Get your credentials
- Copy the Project URL and `anon` public key from Project Settings → API.
- Do not use the session pooler URI in client-side code; use the Project URL.

### 3) Configure environment
- Copy `.env.example` to `.env` and fill values:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Restart the dev server after changes.

### 4) Create a `posts` table
Use the SQL editor in Supabase to create a simple table that matches your mock structure. Example schema:

```sql
create table if not exists posts (
  id bigint primary key generated always as identity,
  title jsonb not null,            -- { rendered: string }
  excerpt jsonb not null,          -- { rendered: string }
  date text not null,              -- ISO date string used by formatDate()
  featured_media text null,        -- optional URL or storage path
  slug text unique null
);
```

Insert a few rows to test.

### 4b) Create a `comments_tbl` for post comments

Run `supabase/comments.sql` in the Supabase SQL editor to create the table and RLS policies. Schema:

```sql
create table if not exists public.comments_tbl (
  id bigint primary key generated always as identity,
  post_id bigint not null references public.posts(id) on delete cascade,
  userName text not null,
  userComment text not null,
  created_at timestamptz not null default now()
);

alter table public.comments_tbl enable row level security;

create policy "Public read comments"
on public.comments_tbl for select to anon using (true);

create policy "Public insert comments"
on public.comments_tbl for insert to anon with check (true);
```

This allows public reads and inserts via the `anon` key. Consider tightening policies if needed.

### 5) Install dependencies

```bash
npm install
```

This includes `@supabase/supabase-js` added to `package.json`.

### 6) Run locally

```bash
npm run dev
```

If env vars are present, `BlogsPage` and `PostDetailPage` will fetch from Supabase; otherwise they use `src/data/mockPosts.ts`.

`PostDetailPage` includes a basic comments form that inserts into `comments_tbl` and lists comments for the current post.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Type-check and build production bundle
- `npm run preview` — Preview the built app locally
