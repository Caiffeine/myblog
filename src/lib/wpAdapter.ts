// Helpers to map WordPress REST API responses to the app's mockPosts shape

export type WpPost = {
  id: number
  date: string
  slug?: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  featured_media?: number
};

export type MockPost = {
  id: number
  date: string
  slug?: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>
  }
};

export function mapWpPostList(posts: WpPost[]): MockPost[] {
  return posts.map(mapWpPost);
}

export function mapWpPost(post: WpPost): MockPost {
  return {
    id: post.id,
    date: post.date,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    // Map _embedded media structure to featured_media string
    _embedded: typeof post.featured_media === 'string' && post.featured_media
      ? { 'wp:featuredmedia': [{ source_url: post.featured_media }] }
      : undefined,
  };
}
