import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function PhotoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            style={{ y, rotate, scale }}
            className="relative group cursor-crosshair"
          >
            {/* Aurora Border */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 animate-spin-slow transition-opacity" />
            
            {/* Glitch Layers */}
            <div className="absolute inset-0 bg-red-500/20 mix-blend-screen opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-75" />
            <div className="absolute inset-0 bg-cyan-500/20 mix-blend-screen opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-75" />
            
            <div className="relative w-72 md:w-[450px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/portrait/1000/1250" 
                alt="Portrait" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-4xl font-bold text-white tracking-tighter mb-2">The Architect</h3>
                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Engineering the Future</p>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                Precision Meets <br />
                <span className="text-gradient">Creativity</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed mb-10 font-light">
                I believe that every line of code is an opportunity to craft something extraordinary. 
                My approach combines the rigor of systems architecture with the intuition of visual design.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-2">Philosophy</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Code should be as elegant as the interface it powers. Performance is a feature, not an afterthought.</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">Vision</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Building digital ecosystems that are scalable, accessible, and inherently beautiful.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
