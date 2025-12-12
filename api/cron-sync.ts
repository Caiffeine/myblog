import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type WpPost = {
  id: number;
  date: string;
  slug?: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  featured_media?: string;
};

async function fetchWpPosts(baseUrl: string): Promise<WpPost[]> {
  const url = baseUrl.includes('wordpress.com')
    ? `https://public-api.wordpress.com/rest/v1.1/sites/${baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/posts?number=100&fields=ID,date,slug,title,excerpt,content,featured_image`
    : `${baseUrl}/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,title,excerpt,content,featured_media`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status}`);
  const data = await res.json();

  if (baseUrl.includes('wordpress.com')) {
    return data.posts.map((p: any) => ({
      id: p.ID,
      date: p.date,
      slug: p.slug,
      title: { rendered: p.title },
      excerpt: { rendered: p.excerpt },
      content: { rendered: p.content },
      featured_media: p.featured_image || null,
    }));
  }

  return data;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Verify the request is from Vercel's cron system
  const authHeader = request.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const wpUrl = process.env.VITE_WP_API_URL;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!wpUrl || !supabaseUrl || !serviceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    console.log('Fetching WordPress posts...');
    const wpPosts = await fetchWpPosts(wpUrl);
    console.log(`Found ${wpPosts.length} posts in WordPress`);

    // Map to DB rows
    const rows = wpPosts.map((p) => ({
      id: p.id,
      date: p.date,
      slug: p.slug ?? null,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content ?? p.excerpt,
      featured_media: typeof p.featured_media === 'string' ? p.featured_media : null,
    }));

    // Get current posts in Supabase
    console.log('Fetching posts from Supabase...');
    const { data: supabasePosts, error: fetchError } = await supabase
      .from('posts')
      .select('id');

    if (fetchError) throw fetchError;

    const supabaseIds = (supabasePosts ?? []).map((p) => p.id);
    const wpIds = wpPosts.map((p) => p.id);

    // Find posts to delete (in Supabase but not in WordPress)
    const postsToDelete = supabaseIds.filter((id) => !wpIds.includes(id));

    if (postsToDelete.length > 0) {
      console.log(
        `Deleting ${postsToDelete.length} posts that were removed from WordPress...`,
      );
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .in('id', postsToDelete);

      if (deleteError) throw deleteError;
      console.log(`Deleted ${postsToDelete.length} posts`);
    }

    // Upsert into posts table
    console.log(`Upserting ${rows.length} posts to Supabase...`);
    const { error, count } = await supabase
      .from('posts')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
      .select('id', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`Synced ${count ?? rows.length} posts to Supabase`);

    return response.status(200).json({
      success: true,
      message: 'WordPress sync completed',
      postsUpserted: count ?? rows.length,
      postsDeleted: postsToDelete.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return response.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
