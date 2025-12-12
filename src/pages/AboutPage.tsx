import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function AboutPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="px-6 py-32 md:py-40">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif text-5xl md:text-6xl font-semibold text-ink tracking-tight leading-none mb-8"
        >
          About
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-16 h-px bg-olive-green mb-12"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <p className="font-sans text-lg text-ink/80 leading-relaxed">
            Welcome to <span className="text-olive-green font-medium">Kobie's Blog</span>—a digital 
            archive where thoughts find their home and ideas take shape through words.
          </p>

          <p className="font-sans text-lg text-ink/80 leading-relaxed">
            This space is dedicated to the art of slow living, the beauty of typography, 
            and the simple pleasures that make life meaningful. Each entry is crafted 
            with intention, inviting you to pause, reflect, and perhaps discover 
            something unexpected.
          </p>

          <p className="font-sans text-lg text-ink/80 leading-relaxed">
            In a world that moves too fast, this blog is my quiet corner—a place 
            where the texture of paper meets the infinity of pixels.
          </p>

          <div className="pt-8 border-t border-border-color">
            <p className="font-mono text-sm text-olive-green tracking-wide">
              Thank you for visiting.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
