'use client';

import { motion } from 'motion/react';
import { fadeUp } from '@/lib/animations';

interface SpeakingItem {
  title: string;
  context: string;
  year: string;
  description: string;
  link?: string;
}

export function AnimatedSpeakingItem({ item, index }: { item: SpeakingItem; index: number }) {
  return (
    <motion.a
      key={index}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} — ${item.context} (opens in new tab)`}
      className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-5 px-5 -mx-5 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03] transition-[border-color,background-color] duration-200"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors duration-200 truncate">
            {item.title}
          </h3>
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 text-muted/55 group-hover:text-accent flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
        <p className="text-sm text-muted mt-0.5">{item.description}</p>
      </div>
      <div className="flex items-center gap-3 sm:ml-8 flex-shrink-0">
        <span className="text-xs font-mono text-muted/80">{item.context}</span>
        <span className="text-xs font-mono text-muted/65">{item.year}</span>
      </div>
    </motion.a>
  );
}
