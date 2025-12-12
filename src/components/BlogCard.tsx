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
        'flex flex-col h-[480px]',
        'border border-olive-green/20',
        'bg-paper',
        'transition-all duration-300 ease-out',
        'hover:shadow-lg hover:-translate-y-1 hover:border-olive-green/40'
      )}
    >
      <Link to={`/post/${post.id}`} className="block flex flex-col h-full">
        {/* Featured Image */}
        {featuredImage && (
          <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0">
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

        {/* Content - Flex grow to fill space */}
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow overflow-hidden">
          {/* Olive accent bar */}
          <div className="absolute left-0 top-0 w-1 h-full bg-olive-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Date - Mono font, olive-green */}
          <time
            dateTime={post.date}
            className="block font-mono text-xs sm:text-sm text-olive-green tracking-wide mb-2 sm:mb-3 flex-shrink-0"
          >
            {formatDate(post.date)}
          </time>

          {/* Title - Serif font */}
          <h2
            className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-ink leading-tight mb-2 sm:mb-3 group-hover:text-olive-green transition-colors duration-300 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Excerpt - Sans font */}
          <div
            className="font-sans text-ink/70 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-grow overflow-hidden"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          {/* Read More Link - Always at bottom */}
          <div className="pt-3 sm:pt-4 border-t border-olive-green/20 flex-shrink-0">
            <span className="font-mono text-xs tracking-widest uppercase text-olive-green group-hover:tracking-[0.2em] transition-all duration-300">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
