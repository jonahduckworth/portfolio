'use client';

import { motion } from 'motion/react';

export function AnimatedNav() {
  return (
    <motion.nav
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3.5 sm:py-5 bg-background/80 backdrop-blur-md border-b border-white/[0.06]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <a href="#" aria-label="Home" className="text-xs sm:text-sm font-medium tracking-tight text-foreground">
        jonah duckworth
      </a>
      <div className="flex items-center gap-3 sm:gap-6">
        <a
          href="#work"
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          work
        </a>
        <a
          href="#ventures"
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          ventures
        </a>
        <a
          href="#speaking"
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          speaking
        </a>
        <a
          href="#contact"
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          contact
        </a>
      </div>
    </motion.nav>
  );
}
