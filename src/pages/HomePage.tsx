import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { mockPosts } from '../data/mockPosts';

export function HomePage() {
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
    </>
  );
}
