import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { mockPosts } from '../data/mockPosts';
import { supabase } from '../lib/supabaseClient';

type Post = typeof mockPosts[number];

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      // Try Supabase first (synced WordPress posts)
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('date', { ascending: false })
          .limit(6);

        if (!error && data && Array.isArray(data) && data.length > 0) {
          setPosts(data as unknown as Post[]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }

      // Fallback: Try WordPress for fresh data
      const wpUrl = import.meta.env.VITE_WP_API_URL as string | undefined;
      if (wpUrl) {
        try {
          // For WordPress.com sites
          const apiUrl = wpUrl.includes('wordpress.com')
            ? `https://public-api.wordpress.com/rest/v1.1/sites/${wpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/posts?number=6&fields=ID,date,slug,title,excerpt,content,featured_image`
            : `${wpUrl}/wp-json/wp/v2/posts?per_page=6&_fields=id,date,slug,title,excerpt,content,featured_media`;
          
          const res = await fetch(apiUrl);
          if (res.ok) {
            const data = await res.json();
            let mapped;
            if (wpUrl.includes('wordpress.com')) {
              mapped = data.posts.map((p: any) => ({
                id: p.ID,
                date: p.date,
                slug: p.slug,
                title: { rendered: p.title },
                excerpt: { rendered: p.excerpt },
                content: { rendered: p.content },
                _embedded: p.featured_image ? {
                  'wp:featuredmedia': [{ source_url: p.featured_image }]
                } : undefined
              }));
            } else {
              mapped = data;
            }
            setPosts(mapped);
            setLoading(false);
            return;
          }
        } catch (err: any) {
          console.warn('WordPress fetch failed:', err);
        }
      }

      // Final fallback: mock data (take first 6)
      setPosts(mockPosts.slice(0, 6));
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Hero Section */}
      <header className="relative px-6 py-24 md:py-32 lg:py-40 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title - Staggered reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-6xl md:text-7xl lg:text-8xl font-semibold text-ink tracking-tight leading-none"
          >
            Kobie's Blog
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="font-mono text-lg md:text-xl text-olive-green mt-6 tracking-wide"
          >
            A digital archive.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="w-24 h-px bg-olive-green mx-auto mt-10"
          />
        </div>
      </header>

      {/* Blog Grid Section */}
      <main className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <span className="font-mono text-sm text-olive-green tracking-widest uppercase">
              Latest Entries
            </span>
            <div className="flex-1 h-px bg-olive-green/30" />
            <span className="font-mono text-sm text-ink/40">
              {posts.length} posts
            </span>
          </motion.div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
