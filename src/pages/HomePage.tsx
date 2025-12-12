import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { BlogCard } from '../components/BlogCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { mockPosts } from '../data/mockPosts';
import { supabase } from '../lib/supabaseClient';

type Post = typeof mockPosts[number];

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [typedText, setTypedText] = useState<string>('');
  const fullText = 'A slow unraveling of who I am becoming.';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Show loading screen for at least 800ms on every mount (page refresh)
    setShowLoadingScreen(true);
    loadingTimeoutRef.current = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 800);

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (showLoadingScreen) return; // Don't start typing until loading screen is done
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // 50ms per character

    return () => clearInterval(typingInterval);
  }, [showLoadingScreen]);

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

  if (showLoadingScreen || loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Hero Section */}
      <header className="relative px-6 py-24 md:py-32 lg:py-40 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title with background gif - Staggered reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-lg overflow-hidden py-12 px-8"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/hero-card-bg.gif)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h1 
              className="font-serif text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-none"
              style={{ textShadow: '0 4px 12px rgba(95, 111, 82, 0.6), 0 2px 6px rgba(95, 111, 82, 0.4)' }}
            >
              Kobie's Blog
            </h1>
            <p 
              className="font-mono text-lg md:text-xl text-white/90 mt-6 tracking-wide min-h-[2rem]"
              style={{ textShadow: '0 2px 8px rgba(95, 111, 82, 0.5), 0 1px 4px rgba(95, 111, 82, 0.3)' }}
            >
              {typedText}
            </p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="w-24 h-px bg-olive-green mx-auto mt-10"
          />
        </div>
      </header>

      {/* Subtitle */}
      <div className="px-6 pb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="font-mono text-base md:text-lg text-olive-green/80 tracking-wide text-center"
        >
          Spinning Stories: Curating memories and moments of becoming
        </motion.p>
      </div>

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
