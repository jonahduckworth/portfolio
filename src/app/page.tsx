'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';

const TimelineItem = ({
  title,
  subtitle,
  description,
  isLeft,
  details,
}: {
  title: string;
  subtitle: string;
  description: string | string[];
  isLeft: boolean;
  details?: {
    technologies?: string[];
    achievements?: string[];
    links?: { text: string; url: string }[];
  };
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const xOffset = isLeft ? -50 : 50;

  return (
    <div className='relative flex w-full items-center justify-center min-h-screen'>
      <motion.div
        className='w-full px-4 cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`
            w-[85%] rounded-xl bg-blue-500/50 hover:bg-blue-500 p-6 transition-all duration-300
            md:w-[40%]
            ${
              isLeft
                ? 'md:mr-[52%] md:ml-auto md:pr-16 md:pl-8 md:text-right'
                : 'md:ml-[52%] md:pl-16 md:text-left'
            }
          `}
        >
          <motion.h3
            className='text-2xl font-bold text-white'
            initial={{ opacity: 0, x: xOffset }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h3>
          <motion.p
            className='mt-2 text-gray-400'
            initial={{ opacity: 0, x: xOffset }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          {/* Basic description */}
          {Array.isArray(description) ? (
            description.map((item, index) => (
              <motion.p
                key={index}
                className='mt-4 text-gray-300'
                initial={{ opacity: 0, x: xOffset }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                {item}
              </motion.p>
            ))
          ) : (
            <motion.p
              className='mt-4 text-gray-300'
              initial={{ opacity: 0, x: xOffset }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {description}
            </motion.p>
          )}

          {/* Expanded details */}
          {details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
            >
              {details.technologies && (
                <div className='mt-6'>
                  <h4 className='text-blue-300 font-semibold mb-2'>
                    Technologies
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {details.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-200'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {details.achievements && (
                <div className='mt-4'>
                  <h4 className='text-blue-300 font-semibold mb-2'>
                    Key Achievements
                  </h4>
                  <ul className='list-disc list-inside text-gray-300'>
                    {details.achievements.map((achievement, index) => (
                      <li key={index} className='mt-2'>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details.links && (
                <div className='mt-4'>
                  <div className='flex flex-wrap gap-3'>
                    {details.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center px-4 py-2 bg-blue-500/30 hover:bg-blue-500/40 rounded-lg text-blue-200 transition-colors duration-300'
                      >
                        {link.text}
                        <svg
                          className='w-4 h-4 ml-2'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <motion.div className='relative min-h-screen flex items-start pt-32 justify-center overflow-hidden px-4 sm:px-6 lg:px-8'>
      <AnimatedBackground />

      <div className='relative z-10 text-center max-w-7xl mx-auto'>
        <motion.h1
          className='text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            type: 'spring',
            bounce: 0.4,
          }}
        >
          <div className='relative text-6xl font-bold mb-8'>
            <span className='relative inline-block'>
              <span className='animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-100 to-blue-600'>
                JD
              </span>
              <div className='absolute inset-0 blur-[20px] animate-glow bg-blue-400/20' />
            </span>
            <span className='relative inline-block ml-4'>
              <span className='animate-gradient-x bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-blue-600 to-blue-100'>
                Builds
              </span>
              <div className='absolute inset-0 blur-[20px] animate-glow bg-blue-400/20' />
            </span>
          </div>
        </motion.h1>

        <motion.div
          className='text-sm sm:text-base md:text-lg text-gray-300 mb-16 max-w-2xl mx-auto space-y-1.5 sm:space-y-2 px-2 sm:px-3'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            type: 'spring',
            bounce: 0.3,
          }}
        >
          <p className='font-mono'>
            <span className='text-blue-400'>const</span>{' '}
            <span className='text-green-400'>expertise</span>{' '}
            <span className='text-blue-400'>=</span>{' '}
            <span className='text-orange-400'>
              &apos;Full Stack Development&apos;
            </span>
          </p>
          <p className='font-mono'>
            <span className='text-blue-400'>const</span>{' '}
            <span className='text-green-400'>focus</span>{' '}
            <span className='text-blue-400'>=</span>{' '}
            <span className='text-orange-400'>
              &apos;Startup Solutions&apos;
            </span>
          </p>
          <p className='font-mono text-blue-300 opacity-75'>
            <span className='text-gray-500'>
              {'// Bringing ideas to production'}
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const JDBuildsPortfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRefs = useRef<HTMLDivElement[]>([]);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      const newIndex = Math.max(
        0,
        Math.min(
          currentIndexRef.current + direction,
          timelineRefs.current.length - 1
        )
      );
      if (newIndex === currentIndexRef.current) return;

      currentIndexRef.current = newIndex;
      setIsScrolling(true);

      const targetItem = timelineRefs.current[newIndex];
      if (!targetItem) return;

      // Calculate the target position to exactly center the item
      const targetPosition = targetItem.offsetTop;

      // Quick, direct scroll with minimal animation
      const duration = 400;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();

      const easeOutQuart = (t: number): number => {
        return 1 - Math.pow(1 - t, 4);
      };

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setTimeout(() => {
            setIsScrolling(false);
          }, 50);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrolling]);

  // Add ref to timeline items
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !timelineRefs.current.includes(el)) {
      timelineRefs.current.push(el);
    }
  };

  return (
    <div
      className='relative min-h-screen bg-black overflow-x-hidden'
      ref={containerRef}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Timeline Container */}
      <div className='relative'>
        {/* Timeline Items */}
        <div className='relative z-10 mx-auto max-w-7xl flex flex-col'>
          <div ref={addToRefs}>
            <TimelineItem
              title='JD Builds'
              subtitle='Software Developer • November 2023 - Present'
              description={[
                'Software developer & entrepreneur specializing in building scalable applications from the ground up',
                'Currently leading development of innovative forest industry solutions while running a successful sports tech company',
                'Always seeking opportunities to build transformative technology solutions',
              ]}
              isLeft={false}
              details={{
                technologies: [
                  'Flutter',
                  'NextJS',
                  'Vercel',
                  'React',
                  'Gatsby',
                  'Netlify',
                  'Vue',
                  'Rust',
                  'Actix Web',
                  'Python',
                  'Flask',
                  'Go',
                  'NodeJS',
                  'Docker',
                  'MySQL',
                  'Postgres',
                  'Firebase',
                  'GCP',
                  'Azure',
                  'Digital Ocean',
                  'Serverless',
                ],
                achievements: [
                  'Extensive experience in startup environments',
                  'Expert at bringing ideas to production',
                  'Experience scaling software from zero to thousands of users',
                  'Built and deployed many websites and mobile apps',
                ],
                links: [
                  { text: 'GitHub', url: 'https://github.com/jonahduckworth' },
                  {
                    text: 'LinkedIn',
                    url: 'https://ca.linkedin.com/in/jonah-duckworth',
                  },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Ref Buddy'
              subtitle='Founder • August 2022 - Present'
              description={[
                'Built and launched a comprehensive officiating platform from concept to market',
                'Led company through pre-accelerator program, established product-market fit, and executed successful go-to-market strategy',
                'Scaled from initial concept to multiple league partnerships',
              ]}
              isLeft={true}
              details={{
                technologies: [
                  'Flutter',
                  'NextJS',
                  'Vercel',
                  'Go',
                  'Digital Ocean',
                  'Firebase',
                  'Postgres',
                  'Serverless',
                ],
                achievements: [
                  'Built entire platform solo before expanding development team',
                  'Scaled to 200+ active users across multiple leagues',
                  'Brought on CTO, Senior Developer, and first Board Member in 2024',
                  'Successfully hit 8-month technical roadmap targets',
                  'Developed and executed complete business strategy including marketing, sales, and customer acquisition',
                ],
                links: [
                  { text: 'Visit Ref Buddy', url: 'https://refbuddy.ca' },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Velocity Showcase'
              subtitle='November 2024'
              description="Emcee'd live on stage in front of 200+ people for the Alberta Catalyzer Velocity Showcase"
              isLeft={false}
              details={{
                links: [
                  {
                    text: 'About Velocity Program',
                    url: 'https://albertacatalyzer.com/velocity',
                  },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='MoneyUp'
              subtitle='Software Developer • December 2023 - October 2024'
              description={[
                'Collaborated with a small team of developers to build a fintech startup application from the ground up',
                'Identified and resolved critical architectural challenges while implementing robust solutions',
              ]}
              isLeft={true}
              details={{
                technologies: [
                  'Flutter',
                  'NextJS',
                  'Python',
                  'Flask',
                  'Azure',
                  'Postgres',
                  'RevenueCat',
                ],
                achievements: [
                  'Implemented critical system architecture improvements',
                  'Developed and optimized cross-platform mobile and web applications',
                  'Contributed to successful scaling of user base through technical optimizations',
                ],
                links: [{ text: 'Visit MoneyUp', url: 'https://moneyup.ca' }],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Telling It Like It Is Podcast'
              subtitle='March 2024'
              description='Spoke with Calgary Angel Investor, Jade Alberts, about all the highs and lows that come with bootstrapping a company to success'
              isLeft={false}
              details={{
                links: [
                  {
                    text: 'Watch Podcast Interview',
                    url: 'https://www.youtube.com/live/3199SHJxb8U?si=wxqlNTEjbWT0txjN',
                  },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='MRU Tech Liftoff Panel'
              subtitle='January 2024'
              description='Spoke on a panel of startup tech founders to share experiences of starting your own company'
              isLeft={true}
              details={{
                links: [
                  {
                    text: 'About Tech Liftoff',
                    url: 'https://www.mtroyal.ca/ProgramsCourses/FacultiesSchoolsCentres/Business/Institutes/InstituteInnovationEntrepreneurship/Tech-Liftoff-Business.htm',
                  },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Velocity Showcase'
              subtitle='November 2023'
              description='Pitched Ref Buddy live on stage in front of 200+ people after completing the Alberta Catalyzer pre-accelerator program'
              isLeft={false}
              details={{
                links: [
                  {
                    text: 'About Velocity Program',
                    url: 'https://albertacatalyzer.com/velocity',
                  },
                ],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Logit Analytics'
              subtitle='Software Developer • May 2022 - December 2022'
              description={[
                'Developing innovative solutions for the forestry industry',
                'Building and maintaining full-stack applications for real-time data analytics',
              ]}
              isLeft={true}
              details={{
                technologies: [
                  'Flutter',
                  'React',
                  'Python',
                  'Flask',
                  'Firebase',
                  'GCP',
                ],
                achievements: [
                  'Developed real-time fire restriction information system for loggers',
                  "Built company's first mobile application using Flutter",
                  'Implemented full-stack features for forestry industry solutions',
                ],
                links: [{ text: 'Visit Logit', url: 'https://logitnow.ca' }],
              }}
            />
          </div>

          <div ref={addToRefs}>
            <TimelineItem
              title='Education'
              subtitle='Thompson Rivers University • May 2022'
              description="Bachelor's Degree in Computing Science"
              isLeft={false}
              details={{
                links: [
                  {
                    text: 'Visit TRU',
                    url: 'https://tru.ca',
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDBuildsPortfolio;
