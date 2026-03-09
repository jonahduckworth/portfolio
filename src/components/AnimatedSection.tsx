'use client';

import { motion } from 'motion/react';
import { type ReactNode } from 'react';
import { fadeUp } from '@/lib/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  margin?: string;
}

export function AnimatedSection({ children, className, margin = '-80px' }: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
    >
      {children}
    </motion.div>
  );
}
