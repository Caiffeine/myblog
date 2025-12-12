import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { mockPosts } from '../data/mockPosts';
import { formatDate, getFeaturedImage } from '../lib/utils';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find((p) => p.id === Number(id));

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
          {/* Excerpt as intro paragraph */}
          <div
            className="font-sans text-xl text-ink/80 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          {/* Placeholder for full content - would come from WordPress */}
          <div className="font-sans text-lg text-ink/70 leading-relaxed space-y-6">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
              aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse 
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
              cupidatat non proident, sunt in culpa qui officia deserunt mollit 
              anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem 
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
              quae ab illo inventore veritatis et quasi architecto beatae vitae 
              dicta sunt explicabo.
            </p>
          </div>
        </motion.div>

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
        </motion.footer>
      </article>
    </main>
  );
}
