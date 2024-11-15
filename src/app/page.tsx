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
}: {
  title: string;
  subtitle: string;
  description: string | string[];
  isLeft: boolean;
}) => {
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

      <div className='w-full px-4'>
        <div
          className={`${
            isLeft ? 'mr-auto pr-16 text-right' : 'ml-auto pl-16 text-left'
          } w-[50%]`}
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
        </div>
      </div>
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
          Full Stack Developer & Entrepreneur
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
            subtitle='Software Developer, 11/2023 - Present'
            description={[
              'Professional experience building scalable full stack applications from the ground up with Flutter, NextJS, React, Rust, Python, Go, Firebase, MySQL, Postgres, GCP, and Azure',
              'Contracted by Cashco Financial for software development work, building and maintaining a brand-new fintech app',
            ]}
            isLeft={false}
          />

          <TimelineItem
            title='Ref Buddy'
            subtitle='Founder, 08/2022 - Present'
            description={[
              'Led the development and launch of a comprehensive officiating tool that streamlines game assignments and performance tracking for sports leagues',
              'Designed and implemented a user-friendly interface across mobile and web applications',
              'Spearheaded a targeted sales strategy that significantly increased market penetration and user acquisition',
              'Brought on a CTO and Senior Software Developer at the beginning of 2024 and commanded a full-stack system rebuild and enhancement operation',
            ]}
            isLeft={true}
          />

          <TimelineItem
            title='Logit Analytics'
            subtitle='Software Developer, 05/2022 - 12/2022'
            description={[
              'Developed a full-stack feature to provide real-time fire restriction information for loggers in the forestry industry, utilizing Python, React, Firebase, and GCP',
              "Built Logit's first mobile app, using Flutter",
            ]}
            isLeft={false}
          />

          <TimelineItem
            title='British Columbia Hockey League'
            subtitle='Western Canada Hockey Official'
            description='Junior A Linesman'
            isLeft={true}
          />

          {/* Public Speaking Section */}
          <TimelineItem
            title='Public Speaking Engagements'
            subtitle='2023 - 2024'
            description={[
              "Emcee'd live on stage in front of 200+ people for the Alberta Catalyzer Velocity Showcase (11/2024)",
              'Spoke with Calgary Angel Investor, Jade Alberts, about bootstrapping a company to success on Telling It Like It Is Podcast (03/2024)',
              'Spoke on a panel of startup tech founders at MRU Tech Liftoff Panel (01/2024)',
              'Pitched Ref Buddy live on stage at Velocity Showcase (11/2023)',
            ]}
            isLeft={false}
          />

          <TimelineItem
            title='Education'
            subtitle='Thompson Rivers University, Kamloops, BC'
            description="Bachelor's Degree in Computing Science (05/2022)"
            isLeft={true}
          />
        </div>
      </div>
    </div>
  );
};

export default JDBuildsPortfolio;
