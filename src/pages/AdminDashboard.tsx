import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

type Post = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
};

type Comment = {
  id: number;
  post_id: number;
  user_name: string;
  user_comment: string;
  created_at: string;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [deleting, setDeleting] = useState<number | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  // Fetch posts and comments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });

      if (postsData) {
        setPosts(postsData as Post[]);
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments_tbl')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsData) {
        setComments(commentsData as Comment[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(id);
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      alert('Error deleting post: ' + error.message);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setDeleting(id);
    const { error } = await supabase.from('comments_tbl').delete().eq('id', id);

    if (error) {
      alert('Error deleting comment: ' + error.message);
    } else {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleting(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-paper px-6 py-32 md:py-40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 pb-8 border-b border-border-color"
        >
          <h1 className="font-serif text-4xl font-semibold text-ink">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-olive-green text-paper px-4 py-2 rounded-sm font-mono text-sm hover:bg-olive-green/90 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          {(['posts', 'comments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-mono text-sm uppercase tracking-widest rounded-sm transition-colors ${
                activeTab === tab
                  ? 'bg-olive-green text-paper'
                  : 'border border-border-color text-ink hover:bg-paper'
              }`}
            >
              {tab === 'posts' ? `Posts (${posts.length})` : `Comments (${comments.length})`}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center font-mono text-ink/50">Loading...</div>
          ) : activeTab === 'posts' ? (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <p className="font-mono text-ink/50">No posts found.</p>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-border-color rounded-sm p-6 flex items-start justify-between hover:bg-paper/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-ink mb-2">
                        {typeof post.title === 'string' ? post.title : post.title.rendered}
                      </h3>
                      <p className="font-mono text-xs text-ink/50 mb-2">ID: {post.id}</p>
                      <p className="font-mono text-xs text-ink/40">
                        {new Date(post.date).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deleting === post.id}
                      className="ml-4 flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-sm font-mono text-xs transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {deleting === post.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="font-mono text-ink/50">No comments found.</p>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-border-color rounded-sm p-6 hover:bg-paper/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-sans font-semibold text-ink">{comment.user_name}</p>
                        <p className="font-mono text-xs text-ink/50">Post ID: {comment.post_id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deleting === comment.id}
                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-sm font-mono text-xs transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deleting === comment.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <p className="font-sans text-ink/80 mb-3">{comment.user_comment}</p>
                    <p className="font-mono text-xs text-ink/40">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
