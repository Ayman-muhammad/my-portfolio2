import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Database, 
  Globe, 
  Layers, 
  Cpu, 
  Cloud, 
  Smartphone, 
  Terminal,
  Zap,
  Shield,
  Palette
} from 'lucide-react';

const skills = [
  { name: 'Frontend', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { name: 'Backend', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { name: 'Cloud', icon: Cloud, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { name: 'Mobile', icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { name: 'DevOps', icon: Terminal, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { name: 'UI/UX', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { name: 'Security', icon: Shield, color: 'text-red-400', bg: 'bg-red-400/10' },
  { name: 'Performance', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
];

export default function SkillsOrbit() {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-950/50">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Zap size={14} />
            Technical Ecosystem
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            The <span className="text-gradient">Tech Stack</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed"
          >
            A high-performance toolkit engineered for scalability, security, and exceptional user experiences.
          </motion.p>
        </div>

        <div className="relative h-[700px] flex items-center justify-center">
          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
            {skills.map((_, i) => {
              const angle = (i * (360 / skills.length)) * (Math.PI / 180);
              const radius = i % 2 === 0 ? 180 : 280;
              const x2 = 50 + (Math.cos(angle) * radius / 7); // Normalized for SVG viewbox
              const y2 = 50 + (Math.sin(angle) * radius / 7);
              return (
                <motion.line
                  key={i}
                  x1="50%" y1="50%"
                  x2={`${50 + (Math.cos(angle) * radius / 7)}%`}
                  y2={`${50 + (Math.sin(angle) * radius / 7)}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              );
            })}
          </svg>

          {/* Orbit Rings with Rotation */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute w-[360px] h-[360px] border border-white/5 rounded-full border-dashed" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute w-[560px] h-[560px] border border-white/5 rounded-full border-dashed flex items-center justify-center" 
          >
             {/* Outer Orbit Ayman Text */}
             <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path id="outerOrbitPath" d="M 50, 50 m -48, 0 a 48,48 0 1,1 96,0 a 48,48 0 1,1 -96,0" />
                </defs>
                <text className="text-[2px] font-bold uppercase tracking-[1em] fill-white">
                  <textPath xlinkHref="#outerOrbitPath">
                    AYMAN • AYMAN • AYMAN • AYMAN • AYMAN • AYMAN •
                  </textPath>
                </text>
              </svg>
            </div>
          </motion.div>
          
          {/* Center Core */}
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="relative z-20 w-32 h-32 glass rounded-[40px] flex items-center justify-center border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] group cursor-pointer"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all" />
            <Code2 size={48} className="text-indigo-500 relative z-10" />
            
            {/* Rotating Ayman Text */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-15px] pointer-events-none"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path id="orbitPath" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                </defs>
                <text className="text-[6px] font-bold uppercase tracking-[0.3em] fill-indigo-400/30">
                  <textPath xlinkHref="#orbitPath">
                    AYMAN • AYMAN • AYMAN • AYMAN •
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* Pulsing Ring */}
            <div className="absolute inset-[-8px] border border-indigo-500/20 rounded-[48px] animate-pulse" />
          </motion.div>

          {/* Skill Nodes */}
          {skills.map((skill, i) => {
            const angle = (i * (360 / skills.length)) * (Math.PI / 180);
            const radius = i % 2 === 0 ? 180 : 280;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                animate={{
                  x: [x, x + (Math.random() * 15 - 7.5), x],
                  y: [y, y + (Math.random() * 15 - 7.5), y],
                }}
                // @ts-ignore
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute flex flex-col items-center group"
                style={{ left: `calc(50% + ${x}px - 2.5rem)`, top: `calc(50% + ${y}px - 2.5rem)` }}
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`w-20 h-20 ${skill.bg} backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all cursor-pointer relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <skill.icon size={32} className={`${skill.color} group-hover:scale-110 transition-transform relative z-10`} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="mt-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white whitespace-nowrap">{skill.name}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
