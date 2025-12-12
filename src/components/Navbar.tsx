import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blogs', label: 'My Blogs' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50',
          'bg-paper/90 backdrop-blur-md',
          'border border-border-color rounded-full',
          'px-2 py-2 shadow-lg shadow-ink/5'
        )}
      >
        <ul className="flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block px-5 py-2 rounded-full',
                    'font-sans text-sm tracking-wide',
                    'transition-all duration-300',
                    isActive
                      ? 'bg-olive-green text-paper'
                      : 'text-ink hover:bg-olive-green/10 hover:text-olive-green'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="md:hidden fixed top-4 right-4 z-50"
      >
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn(
            'p-3 rounded-full',
            'bg-paper/90 backdrop-blur-md',
            'border border-border-color',
            'shadow-lg shadow-ink/5',
            'text-olive-green hover:bg-olive-green/10',
            'transition-all duration-300'
          )}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-ink/20 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'absolute top-0 right-0 h-full w-64',
                'bg-paper border-l border-border-color',
                'shadow-2xl'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col p-6 pt-20">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'block px-6 py-3 rounded-lg',
                            'font-sans text-base tracking-wide',
                            'transition-all duration-300',
                            isActive
                              ? 'bg-olive-green text-paper'
                              : 'text-ink hover:bg-olive-green/10 hover:text-olive-green'
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
