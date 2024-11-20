'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from '@/components/Marquee';
import AnimatedBackground from './components/AnimatedBackground';

const CircleIndicator = () => (
  <div className='absolute flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2 left-[calc(50%+11px)]'>
    <div className='h-4 w-4 rounded-full bg-white' />
  </div>
);

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
    <div className='relative flex w-full items-center justify-center'>
      <motion.div
        className='absolute left-1/2 top-1/2'
        initial={{ opacity: 0, x: xOffset }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CircleIndicator />
      </motion.div>

      <motion.div
        className='w-full px-4 cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`${
            isLeft ? 'mr-auto pr-16 text-right' : 'ml-auto pl-16 text-left'
          } w-[50%] rounded-xl bg-blue-500/5 hover:bg-blue-500/10 p-6 transition-all duration-300`}
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
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const frontEndSkills = ['Flutter', 'NextJS', 'React', 'Gatsby', 'Vue'];
  const backEndSkills = [
    'Rust',
    'NodeJS',
    'Go',
    'Python',
    'Firebase',
    'MySQL',
    'Postgres',
    'GCP',
    'Azure',
  ];

  return (
    <motion.div
      style={{ opacity }}
      className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8'
    >
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
          JD Builds
        </motion.h1>

        <motion.p
          className='text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            type: 'spring',
            bounce: 0.3,
          }}
        >
          Full Stack Development & Startup Solutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className='w-full sm:w-3/4 md:w-1/2 mx-auto relative mt-20'
        >
          {/* First Marquee Container */}
          <motion.div
            className='relative overflow-hidden px-1 my-4'
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          >
            {/* Left gradient */}
            <div className='absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#000913] via-[#000913]/80 to-transparent z-10 pointer-events-none' />

            <div className='relative'>
              <Marquee pauseOnHover speed={40} className='[--duration:15s]'>
                {frontEndSkills.map((skill) => (
                  <div
                    key={skill}
                    className='px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-full backdrop-blur-sm mx-2 transition-colors duration-300'
                  >
                    <span className='text-blue-300 hover:text-blue-200 whitespace-nowrap'>
                      {skill}
                    </span>
                  </div>
                ))}
              </Marquee>
            </div>

            {/* Right gradient */}
            <div className='absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#000913] via-[#000913]/80 to-transparent z-10 pointer-events-none' />
          </motion.div>

          {/* Second Marquee Container */}
          <motion.div
            className='relative overflow-hidden px-1 my-4'
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5 }}
          >
            {/* Left gradient */}
            <div className='absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#000913] via-[#000913]/80 to-transparent z-10 pointer-events-none' />

            <div className='relative'>
              <Marquee
                reverse
                pauseOnHover
                speed={30}
                className='[--duration:25s]'
              >
                {backEndSkills.map((skill) => (
                  <div
                    key={skill}
                    className='px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-full backdrop-blur-sm mx-2 transition-colors duration-300'
                  >
                    <span className='text-blue-300 hover:text-blue-200 whitespace-nowrap'>
                      {skill}
                    </span>
                  </div>
                ))}
              </Marquee>
            </div>

            {/* Right gradient */}
            <div className='absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#000913] via-[#000913]/80 to-transparent z-10 pointer-events-none' />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const JDBuildsPortfolio = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });

  return (
    <div className='relative min-h-screen bg-black overflow-x-hidden'>
      {/* Hero Section */}
      <HeroSection />

      {/* Timeline Container */}
      <div className='relative pb-56' ref={containerRef}>
        {/* Timeline line */}
        <motion.div
          className='absolute left-[calc(50%+11px)] h-full w-0.5 bg-blue-500 origin-top'
          style={{
            scaleY: scrollYProgress,
          }}
        />

        {/* Timeline Items */}
        <div className='relative z-10 mx-auto max-w-7xl flex flex-col gap-32 py-32'>
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
              links: [{ text: 'Visit Ref Buddy', url: 'https://refbuddy.ca' }],
            }}
          />

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
  );
};

export default JDBuildsPortfolio;
