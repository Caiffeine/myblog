import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trash2, AlertCircle } from 'lucide-react';
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

type ConfirmDialogData = {
  type: 'post' | 'comment';
  id: number;
  title?: string;
} | null;

export function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogData>(null);

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
    const post = posts.find(p => p.id === id);
    const title = typeof post?.title === 'string' ? post.title : post?.title.rendered;
    setConfirmDialog({ type: 'post', id, title });
  };

  const handleDeleteComment = async (id: number) => {
    const comment = comments.find(c => c.id === id);
    setConfirmDialog({ type: 'comment', id, title: comment?.user_name });
  };

  const confirmDelete = async () => {
    if (!confirmDialog) return;

    setDeleting(confirmDialog.id);
    
    if (confirmDialog.type === 'post') {
      const { error } = await supabase.from('posts').delete().eq('id', confirmDialog.id);
      if (error) {
        alert('Error deleting post: ' + error.message);
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== confirmDialog.id));
      }
    } else {
      const { error } = await supabase.from('comments_tbl').delete().eq('id', confirmDialog.id);
      if (error) {
        alert('Error deleting comment: ' + error.message);
      } else {
        setComments((prev) => prev.filter((c) => c.id !== confirmDialog.id));
      }
    }
    
    setDeleting(null);
    setConfirmDialog(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-paper px-6 py-32 md:py-40">
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setConfirmDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-paper border-2 border-red-200 rounded-lg shadow-2xl max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-red-50 p-3 rounded-full">
                    <AlertCircle className="text-red-600" size={32} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl font-semibold text-ink text-center mb-2">
                  Confirm Deletion
                </h2>

                {/* Message */}
                <p className="font-sans text-center text-ink/70 mb-6">
                  {confirmDialog.type === 'post'
                    ? `Are you sure you want to delete this post?`
                    : `Are you sure you want to delete this comment from ${confirmDialog.title}?`}
                </p>

                {/* Preview */}
                <div className="bg-paper/50 border border-border-color rounded p-3 mb-6">
                  <p className="font-mono text-xs text-ink/50 mb-1">
                    {confirmDialog.type === 'post' ? 'Post' : 'Comment by'}
                  </p>
                  <p className="font-sans text-sm text-ink truncate">
                    {confirmDialog.title}
                  </p>
                </div>

                {/* Warning */}
                <p className="font-mono text-xs text-red-600 text-center mb-6">
                  This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog(null)}
                    className="flex-1 px-4 py-2 border border-border-color rounded font-mono text-sm text-ink hover:bg-paper/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting === confirmDialog.id}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-paper rounded font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === confirmDialog.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
