import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn, formatDate, getFeaturedImage, type WPPost } from '../lib/utils';

interface BlogCardProps {
  post: WPPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const featuredImage = getFeaturedImage(post);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        'group relative overflow-hidden',
        'border border-olive-green/20',
        'bg-paper',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:-translate-y-1 hover:border-olive-green/40'
      )}
    >
      <Link to={`/post/${post.id}`} className="block">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={featuredImage}
              alt=""
              className={cn(
                'w-full h-full object-cover',
                'grayscale group-hover:grayscale-0',
                'transition-all duration-500 ease-out',
                'group-hover:scale-105'
              )}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-olive-green/5 group-hover:bg-transparent transition-colors duration-300" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Olive accent bar */}
          <div className="absolute left-0 top-0 w-1 h-full bg-olive-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Date - Mono font, olive-green */}
          <time
            dateTime={post.date}
            className="block font-mono text-sm text-olive-green tracking-wide mb-3"
          >
            {formatDate(post.date)}
          </time>

          {/* Title - Serif font */}
          <h2
            className="font-serif text-xl md:text-2xl font-semibold text-ink leading-tight mb-3 group-hover:text-olive-green transition-colors duration-300"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Excerpt - Sans font */}
          <div
            className="font-sans text-ink/70 text-sm leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          {/* Read More Link */}
          <div className="mt-4 pt-4 border-t border-olive-green/20">
            <span className="font-mono text-xs text-olive-green tracking-widest uppercase group-hover:tracking-[0.2em] transition-all duration-300">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
