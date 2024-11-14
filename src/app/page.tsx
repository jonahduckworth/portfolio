'use client';

import React from 'react';
import { motion, useScroll } from 'framer-motion';

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
  return (
    <div className='relative h-screen flex items-center justify-center overflow-hidden'>
      {/* Background gradient */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent' />

      {/* Content container */}
      <div className='relative z-10 text-center'>
        <motion.h1
          className='text-6xl font-bold text-white mb-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          JD Builds
        </motion.h1>

        <motion.p
          className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Full Stack Developer & Entrepreneur
        </motion.p>

        <motion.div
          className='flex gap-6 justify-center flex-wrap'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className='px-4 py-2 bg-blue-500/10 rounded-full backdrop-blur-sm'>
            <span className='text-blue-400'>Flutter</span>
          </div>
          <div className='px-4 py-2 bg-blue-500/10 rounded-full backdrop-blur-sm'>
            <span className='text-blue-400'>NextJS</span>
          </div>
          <div className='px-4 py-2 bg-blue-500/10 rounded-full backdrop-blur-sm'>
            <span className='text-blue-400'>React</span>
          </div>
          <div className='px-4 py-2 bg-blue-500/10 rounded-full backdrop-blur-sm'>
            <span className='text-blue-400'>Python</span>
          </div>
          <div className='px-4 py-2 bg-blue-500/10 rounded-full backdrop-blur-sm'>
            <span className='text-blue-400'>Rust</span>
          </div>
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <motion.div
        className='absolute bottom-12 left-1/2 -translate-x-1/2'
        initial={{ opacity: 1 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className='w-6 h-6 border-2 border-gray-400 rounded-full flex justify-center'>
          <div className='w-1 h-1 bg-gray-400 rounded-full mt-2' />
        </div>
      </motion.div>
    </div>
  );
};

const JDBuildsPortfolio = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });

  return (
    <div className='relative min-h-screen bg-black'>
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
