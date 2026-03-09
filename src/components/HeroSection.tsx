'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20"
      style={{ opacity, y: shouldReduceMotion ? 0 : y }}
    >
      <div className="relative z-10 max-w-3xl">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
        >
          <div className="w-2 h-2 rounded-full bg-accent motion-safe:animate-pulse" />
          <span className="text-sm font-mono text-muted">Calgary, AB</span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
        >
          I build software
          <br />
          <span className="text-accent">from zero to real.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
        >
          Developer and entrepreneur. Founded{' '}
          <a
            href="https://refbuddy.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors duration-200 underline decoration-white/20 underline-offset-4 hover:decoration-accent/50"
          >
            Ref Buddy
          </a>{' '}
          and{' '}
          <a
            href="https://harvestingpro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors duration-200 underline decoration-white/20 underline-offset-4 hover:decoration-accent/50"
          >
            HarvestingPro
          </a>
          . I turn manual processes into software that scales.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] }}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-accent hover:text-white transition-all duration-200"
          >
            See my work
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 17 5-5-5-5" />
              <path d="m13 17 5-5-5-5" />
            </svg>
          </a>
          <a
            href="mailto:jonah@jdbuilds.ca"
            className="inline-flex items-center px-5 py-2.5 border border-white/10 text-sm text-muted hover:text-foreground hover:border-white/25 rounded-full transition-all duration-200"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-transparent via-muted to-transparent"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  );
}
