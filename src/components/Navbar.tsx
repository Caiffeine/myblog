import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function Navbar() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/blogs', label: 'My Blogs' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-50',
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
  );
}
