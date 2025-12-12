import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { mockPosts } from '../data/mockPosts';

export function BlogsPage() {
  return (
    <main className="px-6 py-32 md:py-40">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="max-w-3xl mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-5xl md:text-6xl font-semibold text-ink tracking-tight leading-none mb-8"
          >
            My Blogs
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="w-16 h-px bg-olive-green mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-sans text-lg text-ink/70"
          >
            A collection of thoughts, reflections, and musings on life, art, and everything in between.
          </motion.p>
        </div>

        {/* Section Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="font-mono text-sm text-olive-green tracking-widest uppercase">
            All Entries
          </span>
          <div className="flex-1 h-px bg-olive-green/30" />
          <span className="font-mono text-sm text-ink/40">
            {mockPosts.length} posts
          </span>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
