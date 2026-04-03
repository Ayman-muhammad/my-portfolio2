import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter, MousePointer2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { USER_DATA } from '../../constants';
import Signature from '../Signature';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const rotate = useTransform(scrollY, [0, 500], [0, 15]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] orb-1 rounded-full blur-[120px] ambient-orb" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] orb-3 rounded-full blur-[120px] ambient-orb delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] orb-2 rounded-full blur-[100px] ambient-orb delay-500" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div
            style={{ y: y1, opacity }}
            className="flex-1 text-left"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-indigo-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  Available for new opportunities
                </span>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Signature name={USER_DATA.name} />
                </motion.div>
              </div>
              
              <h1 className="text-6xl md:text-8xl xl:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] relative">
                <motion.span
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="block"
                >
                  Junior Software
                </motion.span>
                <motion.span
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block text-gradient"
                >
                  Engineer
                </motion.span>
                
                {/* Rotating Ayman Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-12 right-0 md:right-20 pointer-events-none"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="relative w-24 h-24 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                      </defs>
                      <text className="text-[10px] font-bold uppercase tracking-[0.2em] fill-indigo-400/50">
                        <textPath xlinkHref="#circlePath">
                          AYMAN • AYMAN • AYMAN • AYMAN •
                        </textPath>
                      </text>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </motion.div>
                </motion.div>
              </h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-light"
              >
                {USER_DATA.bio}
                <br />
                <span className="text-indigo-400/60 font-medium italic mt-2 block">"I don't just write code; I build digital legacies."</span>
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap items-center gap-6"
              >
                <Link to="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-10 py-5 bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all shadow-2xl shadow-indigo-500/40 overflow-hidden"
                  >
                    <span className="relative z-10">Explore Projects</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </Link>

                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black flex items-center gap-3 transition-all shadow-2xl shadow-white/10 overflow-hidden"
                  >
                    <span className="relative z-10">Hire Me</span>
                    <Sparkles size={20} className="relative z-10 text-indigo-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </Link>
                
                <div className="flex items-center gap-4">
                  {[
                    { Icon: Github, href: USER_DATA.socials.github },
                    { Icon: Linkedin, href: USER_DATA.socials.linkedin },
                    { Icon: Twitter, href: USER_DATA.socials.twitter }
                  ].map(({ Icon, href }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:border-indigo-500/50 transition-all text-slate-400 hover:text-white"
                    >
                      <Icon size={22} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Photo / Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotate }}
            className="relative hidden lg:block"
          >
            <div className="relative w-[450px] aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={USER_DATA.photos.hero} 
                alt={USER_DATA.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
              
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-[-20px] glass px-6 py-4 rounded-2xl border-indigo-500/30 flex items-center gap-3 shadow-2xl"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                  <MousePointer2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Based in</p>
                  <p className="text-sm font-bold">{USER_DATA.location}</p>
                </div>
              </motion.div>

              {/* Sketchy Arrow */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-6 -right-6 text-indigo-400"
              >
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-12">
                  <path d="M10 10C30 40 60 40 90 10M90 10L70 15M90 10L85 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute top-12 left-12 font-handwriting text-xl whitespace-nowrap">That's me!</span>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-indigo-500 to-transparent" />
      </motion.div>
    </section>
  );
}
