import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<'iris-in' | 'content' | 'iris-out'>('iris-in');

  useEffect(() => {
    // Phase 1: Iris opens (0 -> 0.8s)
    const irisInTimer = setTimeout(() => {
      setPhase('content');
    }, 800);

    // Phase 2: Show content (0.8s -> 3s)
    const irisOutTimer = setTimeout(() => {
      setPhase('iris-out');
    }, 3000);

    // Phase 3: Iris closes and complete (3s -> 3.8s)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(irisInTimer);
      clearTimeout(irisOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Iris animation: circle expanding/contracting from center
  const getClipPath = () => {
    switch (phase) {
      case 'iris-in':
        return 'circle(0% at 50% 50%)';
      case 'content':
        return 'circle(150% at 50% 50%)';
      case 'iris-out':
        return 'circle(0% at 50% 50%)';
    }
  };

  return (
    <motion.div
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: getClipPath() }}
      transition={{ 
        duration: 0.8, 
        ease: [0.4, 0, 0.2, 1] // Custom easing for smooth iris
      }}
      className="fixed inset-0 bg-olive-green flex items-center justify-center z-50"
    >
      <div className="text-center max-w-2xl px-6">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-6xl md:text-7xl font-semibold text-paper tracking-tight"
          >
            Welcome to
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-5xl md:text-6xl font-semibold text-paper tracking-tight mt-2"
          >
            Kobie's Blog
          </motion.h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-mono text-sm md:text-base text-paper/80 tracking-widest uppercase mb-8"
        >
          A slow unraveling of who I am becoming
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="w-24 h-px bg-paper mx-auto"
        />

        {/* Fade instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-mono text-xs text-paper/50 tracking-wide mt-8"
        >
          Taking you inside...
        </motion.p>
      </div>
    </motion.div>
  );
}
