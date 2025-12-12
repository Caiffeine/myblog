import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { mockPosts } from '../data/mockPosts';
import { useEffect, useState } from 'react';
import { formatDate, getFeaturedImage } from '../lib/utils';
import { mapWpPost } from '../lib/wpAdapter';
import { LoadingScreen } from '../components/LoadingScreen';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<{ id: number; user_name: string; user_comment: string; created_at: string }>>([]);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Scroll to top when id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      
      let foundPost: any = null;

      // Try Supabase first (synced WordPress posts)
      if (!foundPost) {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', Number(id))
            .single();
          
          if (!error && data) {
            foundPost = data;
          }
        } catch (err) {
          console.warn('Supabase fetch failed:', err);
        }
      }

      // Fallback: Try WordPress for fresh data
      if (!foundPost) {
        const wpUrl = import.meta.env.VITE_WP_API_URL as string | undefined;
        if (wpUrl) {
          try {
            // WordPress.com API
            if (wpUrl.includes('wordpress.com')) {
              const siteSlug = wpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
              const res = await fetch(
                `https://public-api.wordpress.com/rest/v1.1/sites/${siteSlug}/posts/${id}?fields=ID,date,slug,title,excerpt,content,featured_image`,
                { signal: AbortSignal.timeout(5000) }
              );
              if (res.ok) {
                const wpPost = await res.json();
                foundPost = {
                  id: wpPost.ID,
                  date: wpPost.date,
                  slug: wpPost.slug,
                  title: { rendered: wpPost.title },
                  excerpt: { rendered: wpPost.excerpt },
                  content: { rendered: wpPost.content },
                  _embedded: wpPost.featured_image ? {
                    'wp:featuredmedia': [{ source_url: wpPost.featured_image }]
                  } : undefined
                };
              }
            } else {
              // Self-hosted WordPress
              const res = await fetch(
                `${wpUrl}/wp-json/wp/v2/posts/${id}?_fields=id,date,slug,title,excerpt,content,featured_media`,
                { signal: AbortSignal.timeout(5000) }
              );
              if (res.ok) {
                const wpPost = await res.json();
                foundPost = mapWpPost(wpPost);
              }
            }
          } catch (err: any) {
            console.warn('WordPress fetch failed:', err);
          }
        }
      }

      // Final fallback: Check mock data
      if (!foundPost) {
        const mockPost = mockPosts.find(p => p.id === Number(id));
        if (mockPost) {
          foundPost = mockPost;
        }
      }

      if (foundPost) {
        setPost(foundPost as any);
      } else {
        setError('Post not found');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('comments_tbl')
          .select('id, user_name, user_comment, created_at')
          .eq('post_id', Number(id))
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching comments:', error);
        } else if (data) {
          setComments(data as any);
        }
      } catch (err) {
        console.error('Exception fetching comments:', err);
      }
    };
    
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      fetchComments();
      
      // Subscribe to real-time updates for this post's comments
      const channel = supabase.channel(`comments-post-${id}`, {
        config: { broadcast: { self: true } }
      });
      
      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments_tbl',
            filter: `post_id=eq.${id}`
          },
          (payload) => {
            console.log('New comment received:', payload);
            const newComment = payload.new as any;
            setComments((prev) => {
              // Avoid duplicates if the comment was already added optimistically
              const exists = prev.some(c => c.id === newComment.id);
              if (exists) return prev;
              return [newComment, ...prev];
            });
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
      
      return () => {
        channel.unsubscribe();
      };
    }
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !userName.trim() || !userComment.trim()) return;
    setCommentSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('comments_tbl')
        .insert({ post_id: Number(id), user_name: userName, user_comment: userComment })
        .select('id, user_name, user_comment, created_at')
        .single();
      
      if (error) {
        console.error('Error submitting comment:', error);
        alert(`Error posting comment: ${error.message}`);
      } else if (data) {
        // Don't add optimistically - let real-time handle it
        // This prevents duplicates since the real-time subscription will add it
        setUserName('');
        setUserComment('');
      }
    } catch (err) {
      console.error('Exception submitting comment:', err);
      alert('Failed to post comment. Check console for details.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading && !post) {
    return <LoadingScreen />;
  }

  if (!post) {
    return (
      <main className="px-6 py-32 md:py-40 text-center">
        <h1 className="font-serif text-4xl text-ink mb-4">Post not found</h1>
        <Link
          to="/blogs"
          className="font-mono text-sm text-olive-green hover:underline"
        >
          ← Back to blogs
        </Link>
      </main>
    );
  }

  const featuredImage = getFeaturedImage(post);

  return (
    <main className="px-6 py-32 md:py-40">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-mono text-sm text-olive-green hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} />
            Back to blogs
          </Link>
        </motion.div>

        {/* Post Header */}
        <header className="mb-12">
          <motion.time
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            dateTime={post.date}
            className="block font-mono text-sm text-olive-green tracking-wide mb-4"
          >
            {formatDate(post.date)}
          </motion.time>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ink tracking-tight leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="w-16 h-px bg-olive-green"
          />
        </header>

        {/* Featured Image */}
        {featuredImage && (
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12 -mx-6 md:mx-0"
          >
            <img
              src={featuredImage}
              alt=""
              className="w-full aspect-video object-cover md:rounded-sm"
            />
          </motion.figure>
        )}

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="prose prose-lg max-w-none"
        >
          {/* Full content from WordPress */}
          {post.content?.rendered ? (
            <div
              className="font-sans text-lg text-ink/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          ) : (
            <div
              className="font-sans text-xl text-ink/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          )}
        </motion.div>

        {/* Comments Section */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-ink mb-4">Comments</h2>
          {import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY ? (
            <>
              <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-border-color rounded-sm px-3 py-2 font-sans"
                />
                <textarea
                  placeholder="Your comment"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full border border-border-color rounded-sm px-3 py-2 font-sans h-28"
                />
                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="px-4 py-2 bg-olive-green text-white rounded-sm font-mono text-sm disabled:opacity-50"
                >
                  {commentSubmitting ? 'Posting…' : 'Post Comment'}
                </button>
              </form>

              <ul className="space-y-6">
                {comments.length === 0 && (
                  <li className="font-sans text-ink/60">No comments yet. Be the first!</li>
                )}
                {comments.map((c) => (
                  <li key={c.id} className="border border-border-color rounded-sm p-4">
                    <div className="font-mono text-xs text-ink/50 mb-2">{new Date(c.created_at).toLocaleString()}</div>
                    <div className="font-sans font-semibold text-ink">{c.user_name}</div>
                    <div className="font-sans text-ink/80">{c.user_comment}</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="font-sans text-ink/60">Comments require Supabase to be configured.</div>
          )}
        </section>

        {/* Post Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-border-color"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-mono text-sm text-olive-green hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} />
            View all posts
          </Link>
          {loading && (
            <div className="mt-4 font-mono text-xs text-ink/40">Loading…</div>
          )}
          {error && (
            <div className="mt-4 font-mono text-xs text-red-600">{error}</div>
          )}
        </motion.footer>
      </article>
    </main>
  );
}
