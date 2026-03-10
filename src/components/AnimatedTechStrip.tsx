'use client';

import { motion } from 'motion/react';
import { fadeUp, stagger } from '@/lib/animations';

const categories = [
  {
    label: 'Frontend',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Flutter', 'React Native'],
  },
  {
    label: 'Backend',
    tools: ['Rust', 'Go', 'Python', 'Node.js', 'Postgres', 'Redis', 'Snowflake', 'Firebase'],
  },
  {
    label: 'Infra',
    tools: ['GCP', 'Azure', 'DigitalOcean', 'Hetzner', 'Docker', 'Dokploy'],
  },
];

export function AnimatedTechStrip() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-white/[0.06]">
      <motion.div
        className="space-y-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {categories.map((cat) => (
          <div key={cat.label} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-mono text-muted uppercase tracking-widest w-20 flex-shrink-0">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {cat.tools.map((tool) => (
                <motion.span
                  key={tool}
                  className="text-xs font-mono text-muted/90 px-3 py-1.5 rounded-full border border-white/[0.07] hover:border-white/[0.12] hover:text-muted transition-all duration-200"
                  variants={fadeUp}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
