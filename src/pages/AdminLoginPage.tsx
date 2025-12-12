import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple auth check with hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      // Store admin session token
      localStorage.setItem('adminToken', btoa(`${username}:${password}`));
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-paper px-6 py-32 md:py-40 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-olive-green rounded-full mb-4"
          >
            <Lock size={32} className="text-paper" />
          </motion.div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Admin Access</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block font-mono text-xs text-ink/70 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border-color rounded-sm px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-olive-green"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-mono text-xs text-ink/70 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border-color rounded-sm px-4 py-2 font-sans focus:outline-none focus:ring-2 focus:ring-olive-green"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-sm px-4 py-2 font-mono text-xs text-red-600"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-olive-green text-paper font-mono text-sm py-3 rounded-sm disabled:opacity-50 transition-opacity hover:bg-olive-green/90"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
