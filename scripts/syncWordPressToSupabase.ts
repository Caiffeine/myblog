/*
  Sync WordPress posts into Supabase `public.posts`.
  Usage:
    - Set env: SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL, VITE_WP_API_URL
    - Run: npm run sync:wp

  Notes:
    - Uses Supabase service key (server-side) to bypass RLS for upsert.
    - Maps WP fields to the app's mockPosts schema stored in Postgres.
*/

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

type WpPost = {
  id: number
  date: string
  slug?: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  featured_media?: number
}

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

async function fetchWpPosts(baseUrl: string): Promise<WpPost[]> {
  // WordPress.com uses a different API path
  const url = baseUrl.includes('wordpress.com')
    ? `https://public-api.wordpress.com/rest/v1.1/sites/${baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/posts?number=100&fields=ID,date,slug,title,excerpt,content,featured_image`
    : `${baseUrl}/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,title,excerpt,content,featured_media`
  
  const res = await fetch(url)
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  
  // WordPress.com returns posts in a different structure
  if (baseUrl.includes('wordpress.com')) {
    return data.posts.map((p: any) => ({
      id: p.ID,
      date: p.date,
      slug: p.slug,
      title: { rendered: p.title },
      excerpt: { rendered: p.excerpt },
      content: { rendered: p.content },
      featured_media: p.featured_image || null
    }))
  }
  
  return data
}

async function main() {
  const wpUrl = env('VITE_WP_API_URL')
  const supabaseUrl = env('VITE_SUPABASE_URL')
  const serviceKey = env('SUPABASE_SERVICE_KEY')

  const supabase = createClient(supabaseUrl, serviceKey)

  const wpPosts = await fetchWpPosts(wpUrl)

  // Map to DB rows matching posts schema
  const rows = wpPosts.map((p) => ({
    id: p.id,
    date: p.date,
    slug: p.slug ?? null,
    title: p.title, // jsonb
    excerpt: p.excerpt, // jsonb
    featured_media: typeof p.featured_media === 'string' ? p.featured_media : null,
  }))

  // Upsert into posts table by primary key id
  const { error, count } = await supabase
    .from('posts')
    .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  // eslint-disable-next-line no-console
  console.log(`Synced ${count ?? rows.length} posts to Supabase`)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Sync failed:', err)
  process.exit(1)
})
