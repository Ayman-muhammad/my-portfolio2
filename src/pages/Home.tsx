import React from 'react';
import { motion, useScroll, useSpring, useInView } from 'motion/react';
import Hero from '../components/sections/Hero';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import SkillsOrbit from '../components/sections/SkillsOrbit';
import KineticDeck from '../components/sections/KineticDeck';
import PhotoSection from '../components/sections/PhotoSection';
import MySetup from '../components/sections/MySetup';
import NeuralCommand from '../components/NeuralCommand';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-guru-bg min-h-screen relative overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 orb-1 rounded-full blur-3xl ambient-orb" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] orb-2 rounded-full blur-3xl ambient-orb delay-1000" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 orb-3 rounded-full blur-3xl ambient-orb delay-2000" />
        
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] pointer-events-none" />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div 
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 origin-left z-50"
      />

      <div className="relative z-10">
        <SectionWrapper delay={0}>
          <Hero />
        </SectionWrapper>
        
        <SectionWrapper delay={0.1}>
          <PhotoSection />
        </SectionWrapper>

        <SectionWrapper delay={0.2}>
          <div id="skills-section">
            <SkillsOrbit />
          </div>
        </SectionWrapper>

        <SectionWrapper delay={0.3}>
          <KineticDeck />
        </SectionWrapper>

        <SectionWrapper delay={0.4}>
          <MySetup />
        </SectionWrapper>

        <SectionWrapper delay={0.5}>
          <div id="projects-section">
            <FeaturedProjects />
          </div>
        </SectionWrapper>
      </div>

      <NeuralCommand />
    </motion.main>
  );
}

function SectionWrapper({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
