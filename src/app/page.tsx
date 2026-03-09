import { MotionProvider } from '@/components/MotionProvider';
import { AnimatedNav } from '@/components/AnimatedNav';
import { HeroSection } from '@/components/HeroSection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AnimatedTechStrip } from '@/components/AnimatedTechStrip';
import { AnimatedSpeakingItem } from '@/components/AnimatedSpeakingItem';
import { ParticleFieldWrapper } from '@/components/ParticleFieldWrapper';

// ——— Section header ———

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <AnimatedSection className="mb-12 md:mb-16">
      <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
        {label}
      </span>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h2>
    </AnimatedSection>
  );
}

// ——— Venture card (founded companies) ———

interface Venture {
  name: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
  link?: string;
  featured?: boolean;
}

function VentureCard({ venture }: { venture: Venture }) {
  const inner = (
    <div
      className={`group relative p-6 md:p-8 rounded-2xl border transition-[border-color,background-color] duration-300 ${
        venture.featured
          ? 'border-accent/30 bg-accent/[0.04] hover:border-accent/50 hover:bg-accent/[0.06]'
          : 'border-white/[0.10] bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.05]'
      }`}
    >
      {venture.featured && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest px-2.5 py-1 border border-accent/20 rounded-full">
            Featured
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3
              className={`text-xl md:text-2xl font-semibold tracking-tight ${
                venture.featured ? 'text-accent' : 'text-foreground'
              }`}
            >
              {venture.name}
            </h3>
            {venture.link && (
              <svg
                aria-hidden="true"
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
            {venture.role} · {venture.period} · {venture.location}
          </p>
        </div>

        <p className="text-[15px] text-muted leading-relaxed">
          {venture.description}
        </p>

        <ul className="space-y-2">
          {venture.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted/80 leading-relaxed">
              <span className="text-accent/60 mt-0.5 flex-shrink-0">›</span>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {venture.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-muted/80 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.07]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (venture.link) {
    return (
      <a href={venture.link} target="_blank" rel="noopener noreferrer" aria-label={`${venture.name} (opens in new tab)`} className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

const ventures: Venture[] = [
  {
    name: 'Ref Buddy',
    role: 'Founder & Technical Lead',
    period: '2022 – present',
    location: 'Calgary',
    description:
      'Built a sports officiating platform from scratch to fix scheduling problems I dealt with as a hockey ref. Replaced spreadsheets and email chains with real-time scheduling, expense tracking, and game reports.',
    highlights: [
      'Single-handedly built the entire platform — now used by multiple hockey leagues across Western Canada',
      'Smart scheduling algorithms that cut administrative overhead for league coordinators',
      'Expense system replaced a weekly Excel-and-email process — submission time went from minutes to seconds',
      'Game and video reports auto-populate details, cutting report completion time by 80%+',
    ],
    tech: ['Flutter', 'Next.js', 'Go', 'GraphQL', 'DigitalOcean', 'GCP'],
    link: 'https://refbuddy.ca',
    featured: true,
  },
  {
    name: 'HarvestingPro',
    role: 'Co-Founder & Technical Lead',
    period: '2024 – present',
    location: 'Calgary',
    description:
      'Partnered with forestry operators to replace their fragmented spreadsheet workflows with a unified platform for tracking equipment, employees, and project profitability.',
    highlights: [
      "Delivered functional MVP in 4 months — met the client's operational deadlines",
      'Real-time project tracking and expense dashboards so operators spot unprofitable work early',
      'Recruited a dev to build a React Native time-card app for field crews',
    ],
    tech: ['Next.js', 'Rust', 'React Native', 'Postgres'],
    link: 'https://harvestingpro.com',
  },
];

function Ventures() {
  return (
    <section
      id="ventures"
      className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.06]"
    >
      <SectionHeader label="Ventures" title="Companies I founded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {ventures.map((venture) => (
          <AnimatedSection key={venture.name} margin="-60px">
            <VentureCard venture={venture} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

// ——— Work card (consulting / employment) ———

interface WorkItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
  link?: string;
}

function WorkCard({ item }: { item: WorkItem }) {
  const inner = (
    <div className="group relative p-6 md:p-8 rounded-2xl border border-white/[0.10] bg-white/[0.03] hover:border-white/[0.18] hover:bg-white/[0.05] transition-[border-color,background-color] duration-300">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
              {item.company}
            </h3>
            {item.link && (
              <svg
                aria-hidden="true"
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
            {item.role} · {item.period} · {item.location}
          </p>
        </div>

        <p className="text-[15px] text-muted leading-relaxed">
          {item.description}
        </p>

        <ul className="space-y-2">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted/80 leading-relaxed">
              <span className="text-white/20 mt-0.5 flex-shrink-0">›</span>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {item.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono text-muted/80 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.07]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (item.link) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`${item.company} (opens in new tab)`} className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

const workItems: WorkItem[] = [
  {
    company: 'Solea Energy',
    role: 'Software Developer Consultant',
    period: '2025',
    location: 'Kansas City (remote)',
    description:
      'Brought on to turn manual Python scripts and spreadsheets into a real trading platform for financial transmission rights traders.',
    highlights: [
      'Built a distributed Rust backend with dedicated executor APIs on individual VMs — traders run models in parallel without blocking each other',
      'Three-tier data layer: Snowflake for heavy computation, MongoDB for workflows, Redis for real-time log streaming',
      'Live model execution with log streaming from executor APIs to the frontend — traders build, queue, and monitor without leaving the browser',
    ],
    tech: ['Rust', 'Snowflake', 'MongoDB', 'Redis', 'Next.js'],
    link: 'https://soleaenergy.com',
  },
  {
    company: 'MoneyUp',
    role: 'Software Developer Consultant',
    period: '2023 – 2024',
    location: 'Edmonton (remote)',
    description:
      'Joined during alpha. Helped scale the fintech platform from early adopters to thousands of active users.',
    highlights: [
      'Designed a daily accrual system with smart rounding that made loan terms actually understandable — support tickets dropped',
      'Built subscription payment flows that established recurring revenue beyond transaction fees',
      'Redis caching and query optimization for measurably faster load times at scale',
    ],
    tech: ['Flutter', 'Next.js', 'Python', 'Azure', 'Postgres', 'Redis'],
    link: 'https://moneyup.ca',
  },
  {
    company: 'LogIt Analytics',
    role: 'Software Developer',
    period: '2022',
    location: 'Kamloops (remote)',
    description:
      'Early hire at a forestry tech company. Built safety and compliance features and shipped their first mobile app.',
    highlights: [
      'Real-time fire restriction monitoring system — loggers get immediate visibility into compliance requirements',
      "Built the company's first Flutter mobile app, bringing the platform to field workers",
    ],
    tech: ['Flutter', 'React', 'Python', 'Firebase', 'GCP'],
    link: 'https://logitnow.ca',
  },
];

function Work() {
  return (
    <section id="work" className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
      <SectionHeader label="Work" title="Consulting & roles" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {workItems.map((item) => (
          <AnimatedSection key={item.company} margin="-60px">
            <WorkCard item={item} />
          </AnimatedSection>
        ))}
      </div>
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
    description: 'Hosted the showcase live on stage. Founders pitched to a live audience of peers and community members.',
    link: 'https://albertacatalyzer.com/velocity',
  },
  {
    title: 'Telling It Like It Is',
    context: 'Podcast w/ Jade Alberts',
    year: '2024',
    description:
      'Talked with Calgary angel investor Jade Alberts about the real highs and lows of bootstrapping a startup.',
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
    title: 'Velocity — Pitch',
    context: 'Alberta Catalyzer',
    year: '2023',
    description:
      'Pitched Ref Buddy live to 200+ people after completing the eight-week pre-accelerator program.',
    link: 'https://albertacatalyzer.com/velocity',
  },
];

function Speaking() {
  return (
    <section
      id="speaking"
      className="px-6 md:px-12 lg:px-24 py-24 md:py-32 border-t border-white/[0.06]"
    >
      <SectionHeader label="Speaking" title="Talks & appearances" />
      <div className="space-y-1">
        {speakingItems.map((item, i) => (
          <AnimatedSpeakingItem key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

// ——— Education ———

function Education() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-white/[0.06]">
      <AnimatedSection margin="-40px">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2 block">
              Education
            </span>
            <h3 className="text-lg font-medium">BSc Computing Science</h3>
          </div>
          <div className="text-sm text-muted font-mono">
            Thompson Rivers University · Kamloops · 2022
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

// ——— Footer ———

function Footer() {
  const links = [
    { label: 'GitHub', href: 'https://github.com/jonahduckworth' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jonah-duckworth' },
    { label: 'Email', href: 'mailto:jonah@jdbuilds.ca' },
  ];

  return (
    <footer
      id="contact"
      className="px-6 md:px-12 lg:px-24 py-16 md:py-24 border-t border-white/[0.06]"
    >
      <AnimatedSection margin="-40px">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-widest mb-3 block">
              Contact
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              Let&apos;s build something.
            </h2>
            <p className="text-muted text-sm max-w-md">
              Open to interesting projects. If you&apos;re a startup that needs to
              ship, reach out.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.href.startsWith('mailto') ? `Email Jonah Duckworth` : `${link.label} (opens in new tab)`}
                className="text-sm text-muted hover:text-foreground transition-colors duration-200 underline decoration-white/10 underline-offset-4 hover:decoration-accent/50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-16 pt-8 border-t border-white/[0.06] text-xs text-muted/70 font-mono">
        © {new Date().getFullYear()} Jonah Duckworth
      </AnimatedSection>
    </footer>
  );
}

// ——— Page ———

export default function Page() {
  return (
    <MotionProvider>
      <main className="relative">
        <ParticleFieldWrapper />
        <AnimatedNav />
        <HeroSection />
        <Ventures />
        <Work />
        <AnimatedTechStrip />
        <Speaking />
        <Education />
        <Footer />
      </main>
    </MotionProvider>
  );
}
