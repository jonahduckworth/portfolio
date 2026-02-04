'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// ——— Shared animation variants ———

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

// ——— Nav ———

function Nav() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-md border-b border-white/[0.04]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <a href="#" className="text-sm font-medium tracking-tight text-foreground">
        jonah duckworth
      </a>
      <div className="flex items-center gap-6">
        <a
          href="#work"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          work
        </a>
        <a
          href="#speaking"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          speaking
        </a>
        <a
          href="#contact"
          className="text-sm text-muted hover:text-foreground transition-colors duration-200"
        >
          contact
        </a>
      </div>
    </motion.nav>
  );
}

// ——— Hero ———

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20"
      style={{ opacity, y }}
    >
      {/* Subtle gradient orb */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl">
        <motion.div
          className="flex items-center gap-3 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-mono text-muted">Calgary, AB</span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          I build software
          <br />
          <span className="text-accent">from zero to real.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-10"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
        >
          Developer and entrepreneur. Founded{' '}
          <a href="https://refbuddy.ca" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors duration-200 underline decoration-white/20 underline-offset-4 hover:decoration-accent/50">
            Ref Buddy
          </a>
          . Run{' '}
          <span className="text-foreground">JD Builds</span> — consulting for startups that need to ship.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-accent hover:text-white transition-all duration-200"
          >
            See my work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 17 5-5-5-5" /><path d="m13 17 5-5-5-5" />
            </svg>
          </a>
          <a
            href="mailto:jonahduckworth@gmail.com"
            className="inline-flex items-center px-5 py-2.5 border border-white/10 text-sm text-muted hover:text-foreground hover:border-white/25 rounded-full transition-all duration-200"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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

// ——— Section header ———

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div
      className="mb-12 md:mb-16"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={0}
    >
      <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
        {label}
      </span>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
    </motion.div>
  );
}

// ——— Project card ———

interface Project {
  name: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  link?: string;
  featured?: boolean;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const inner = (
    <motion.div
      className={`group relative p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
        project.featured
          ? 'border-accent/20 bg-accent/[0.02] hover:border-accent/40 hover:bg-accent/[0.04]'
          : 'border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03]'
      }`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      custom={index * 0.1}
    >
      {project.featured && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest px-2.5 py-1 border border-accent/20 rounded-full">
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-xl md:text-2xl font-semibold tracking-tight ${project.featured ? 'text-accent' : 'text-foreground'}`}>
              {project.name}
            </h3>
            {project.link && (
              <svg
                className="w-4 h-4 text-muted group-hover:text-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
            )}
          </div>
          <p className="text-sm text-muted font-mono">
            {project.role} · {project.period}
          </p>
        </div>

        <p className="text-[15px] text-muted leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-muted/70 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.04]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

// ——— Projects section ———

const projects: Project[] = [
  {
    name: 'Ref Buddy',
    role: 'Founder',
    period: '2022 – present',
    description:
      'Built an officiating platform solo from concept to market. 200+ active users, multiple league partnerships. Brought on a CTO, senior dev, and board member as it grew.',
    tech: ['Flutter', 'Go', 'Next.js', 'Postgres', 'Firebase', 'Digital Ocean'],
    link: 'https://refbuddy.ca',
    featured: true,
  },
  {
    name: 'JD Builds',
    role: 'Founder',
    period: '2023 – present',
    description:
      'Software consulting for startups that need to move fast. Full-stack builds from first commit to production.',
    tech: ['React', 'Next.js', 'Go', 'Rust', 'Node', 'Docker', 'GCP'],
  },
  {
    name: 'MoneyUp',
    role: 'Developer',
    period: '2023 – 2024',
    description:
      'Fintech startup. Built cross-platform mobile and web app with a small team. Solved critical architecture problems early.',
    tech: ['Flutter', 'Next.js', 'Python', 'Azure', 'Postgres'],
    link: 'https://moneyup.ca',
  },
  {
    name: 'Logit Analytics',
    role: 'Developer',
    period: '2022',
    description:
      'Forestry tech. Built real-time fire restriction system for loggers. First mobile app the company ever shipped.',
    tech: ['Flutter', 'React', 'Python', 'Firebase', 'GCP'],
    link: 'https://logitnow.ca',
  },
];

function Work() {
  return (
    <section id="work" className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
      <SectionHeader label="Work" title="Things I've built" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

// ——— Tech strip ———

function TechStrip() {
  const tools = [
    'Flutter', 'React', 'Next.js', 'Go', 'Rust', 'Python', 'Node',
    'Postgres', 'Firebase', 'Docker', 'GCP', 'Azure', 'Digital Ocean',
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-white/[0.04]">
      <motion.div
        className="flex flex-wrap gap-3 justify-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {tools.map((tool, i) => (
          <motion.span
            key={tool}
            className="text-xs font-mono text-muted/50 px-3 py-1.5 rounded-full border border-white/[0.04] hover:border-white/[0.12] hover:text-muted transition-all duration-200"
            variants={fadeUp}
            custom={i * 0.03}
          >
            {tool}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}

// ——— Speaking ———

interface SpeakingItem {
  title: string;
  context: string;
  year: string;
  description: string;
  link?: string;
}

const speakingItems: SpeakingItem[] = [
  {
    title: 'Velocity Showcase — Emcee',
    context: 'Alberta Catalyzer',
    year: '2024',
    description: 'Hosted the showcase live on stage, 200+ attendees.',
    link: 'https://albertacatalyzer.com/velocity',
  },
  {
    title: 'Telling It Like It Is',
    context: 'Podcast w/ Jade Alberts',
    year: '2024',
    description: 'Talked bootstrapping, the real ups and downs of building a company from nothing.',
    link: 'https://www.youtube.com/live/3199SHJxb8U?si=wxqlNTEjbWT0txjN',
  },
  {
    title: 'Tech Liftoff Panel',
    context: 'Mount Royal University',
    year: '2024',
    description: 'Panel on what it actually takes to start a tech company.',
    link: 'https://www.mtroyal.ca/ProgramsCourses/FacultiesSchoolsCentres/Business/Institutes/InstituteInnovationEntrepreneurship/Tech-Liftoff-Business.htm',
  },
  {
    title: 'Velocity Showcase — Pitch',
    context: 'Alberta Catalyzer',
    year: '2023',
    description: 'Pitched Ref Buddy to 200+ people after completing the pre-accelerator.',
    link: 'https://albertacatalyzer.com/velocity',
  },
];

function Speaking() {
  return (
    <section id="speaking" className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.04]">
      <SectionHeader label="Speaking" title="Talks & appearances" />
      <div className="space-y-1">
        {speakingItems.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 py-4 px-4 -mx-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            custom={i * 0.08}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-medium text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                  {item.title}
                </h3>
                <svg
                  className="w-3.5 h-3.5 text-muted/40 group-hover:text-accent flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
              <p className="text-sm text-muted/60 mt-0.5">{item.description}</p>
            </div>
            <div className="flex items-center gap-3 sm:ml-8 flex-shrink-0">
              <span className="text-xs font-mono text-muted/40">{item.context}</span>
              <span className="text-xs font-mono text-muted/30">{item.year}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// ——— Education ———

function Education() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-white/[0.04]">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        custom={0}
      >
        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2 block">
            Education
          </span>
          <h3 className="text-lg font-medium">BSc Computing Science</h3>
        </div>
        <div className="text-sm text-muted font-mono">
          Thompson Rivers University · 2022
        </div>
      </motion.div>
    </section>
  );
}

// ——— Footer ———

function Footer() {
  const links = [
    { label: 'GitHub', href: 'https://github.com/jonahduckworth' },
    { label: 'LinkedIn', href: 'https://ca.linkedin.com/in/jonah-duckworth' },
    { label: 'Email', href: 'mailto:jonahduckworth@gmail.com' },
  ];

  return (
    <footer id="contact" className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-t border-white/[0.04]">
      <motion.div
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        custom={0}
      >
        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
            Contact
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Let&apos;s build something.
          </h2>
          <p className="text-muted text-sm max-w-md">
            Open to interesting projects. If you&apos;re a startup that needs to ship, reach out.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors duration-200 underline decoration-white/10 underline-offset-4 hover:decoration-accent/50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-16 pt-8 border-t border-white/[0.04] text-xs text-muted/30 font-mono"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.1}
      >
        © {new Date().getFullYear()} Jonah Duckworth
      </motion.div>
    </footer>
  );
}

// ——— Page ———

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Work />
      <TechStrip />
      <Speaking />
      <Education />
      <Footer />
    </main>
  );
}
