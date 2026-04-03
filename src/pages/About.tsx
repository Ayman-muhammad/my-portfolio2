import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from 'motion/react';
import { 
  Code2, Database, Globe, Layers, Cpu, Cloud, Terminal, Zap, Palette, 
  ArrowRight, Download, BookOpen, Music, Coffee, Github, Linkedin, 
  Twitter, ExternalLink, Award, Sparkles, CheckCircle2, PlayCircle, 
  Eye, MessageSquare, History, Rocket
} from 'lucide-react';
import { USER_DATA } from '../constants';
import { Link } from 'react-router-dom';

// --- UTILITY COMPONENTS ---

const TextDecode = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [inView, text]);

  return <span ref={ref} className={className}>{displayText}</span>;
};

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// --- SUB-SECTIONS ---

const AuroraPhoto = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {/* Aurora Border */}
      <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-xl animate-pulse" />
      <div className="absolute -inset-0.5 rounded-[41px] bg-gradient-conic from-indigo-500 via-violet-500 to-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_8s_linear_infinite]" />
      
      <motion.div 
        className="relative w-full aspect-[4/5] glass rounded-[40px] overflow-hidden cursor-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.img 
          style={{ y }}
          src={USER_DATA.photos.about} 
          alt={USER_DATA.name} 
          className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 ${isHovered ? 'animate-glitch' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Hover Reveal Caption */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex items-end justify-center p-8 bg-gradient-to-t from-slate-950/80 to-transparent"
            >
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Behind the Scenes</p>
                <p className="text-sm text-white italic">"Debugging at 3am, Nairobi — Finding elegance in chaos."</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Cursor for Photo */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed w-12 h-12 bg-white rounded-full mix-blend-difference pointer-events-none z-50 flex items-center justify-center"
              style={{ left: "var(--x)", top: "var(--y)" }}
            >
              <Eye size={20} className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const StoryBeats = () => {
  const beats = [
    {
      year: "2023",
      title: "The Foundation",
      content: "Started my journey in Computer Science at Mount Kenya University, diving deep into algorithms and system design.",
      icon: History
    },
    {
      year: "2024",
      title: "Full-Stack Mastery",
      content: "Developed Ayglobe Ta’alim Nexa, a comprehensive educational platform, mastering PHP, MySQL, and secure file handling.",
      icon: Rocket
    },
    {
      year: "2025",
      title: "Mobile Innovation",
      content: "Architected Monexia, an enterprise-ready Android financial analytics platform using Kotlin and Room ORM.",
      icon: Sparkles
    }
  ];

  return (
    <div className="space-y-12">
      {beats.map((beat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="relative pl-8 border-l border-white/10 group"
        >
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block">{beat.year}</span>
          <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{beat.title}</h3>
          <p className="text-slate-400 leading-relaxed text-lg italic">"{beat.content}"</p>
        </motion.div>
      ))}
    </div>
  );
};

const ProvenSkills = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Frontend', 'Backend', 'Database'];
  
  const skills = [
    { name: "Python", category: "Backend", impact: "Built secure healthcare management systems with Django", project: "Hospital Management", icon: Code2 },
    { name: "PHP", category: "Backend", impact: "Developed full-stack educational platforms with role-based auth", project: "Ayglobe Ta’alim Nexa", icon: Cpu },
    { name: "MySQL", category: "Database", impact: "Designed normalized schemas for complex financial data", project: "Monexia", icon: Database },
    { name: "JavaScript", category: "Frontend", proficiency: 85, impact: "Implemented real-time engagement counters and dynamic UIs", project: "Educational Portal", icon: Terminal },
    { name: "React.js", category: "Frontend", impact: "Building responsive, mobile-first web applications", project: "Portfolio Engine", icon: Globe },
    { name: "Kotlin", category: "Mobile", impact: "Architected structured local persistence with Room ORM", project: "Monexia Android", icon: Layers },
  ];

  const filteredSkills = filter === 'All' ? skills : skills.filter(s => s.category === filter);

  return (
    <section id="proven-skills" className="mb-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Proven Arsenal</h2>
          <p className="text-slate-400">Not just tools I use, but systems I've mastered and scaled.</p>
        </div>
        
        <div className="flex gap-6 border-b border-white/5 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative text-sm font-bold uppercase tracking-widest transition-colors ${filter === cat ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
            >
              {cat}
              {filter === cat && (
                <motion.div layoutId="skill-filter" className="absolute -bottom-[10px] left-0 w-full h-0.5 bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, i) => (
            <motion.div
              layout
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="glass p-8 rounded-[32px] group hover:border-indigo-500/50 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                  <skill.icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">{skill.category}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-4">{skill.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{skill.impact}</p>
              
              <div className="pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Key Project</p>
                <p className="text-sm text-white font-medium">{skill.project}</p>
              </div>

              {/* Decorative background icon */}
              <skill.icon size={120} className="absolute -bottom-10 -right-10 text-white/[0.02] group-hover:text-indigo-500/[0.05] transition-colors pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ExperienceTimeline = () => {
  const experiences = [
    {
      company: "Independent Software Development",
      role: "Junior Software Engineer",
      period: "2025 - Present",
      impact: "Independently designed, built, and deployed multiple academic and personal software projects. Practicing full development lifecycle including requirement analysis, implementation, debugging, and deployment.",
      stack: ["Python", "PHP", "JavaScript", "SQL"],
      metric: "Full Lifecycle Mastery"
    },
    {
      company: "Mount Kenya University",
      role: "Computer Science Student",
      period: "2023 - 2027",
      impact: "Focusing on Data Structures, Algorithms, Database Systems, and Software Engineering. Expected graduation in 2027.",
      stack: ["Java", "C++", "Discrete Math", "OS"],
      metric: "Academic Excellence"
    }
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section className="mb-40" ref={containerRef}>
      <div className="flex items-center gap-6 mb-20">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">The Proof</h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="relative">
        {/* Vertical Line for Desktop */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
        <svg className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px h-full hidden md:block overflow-visible" preserveAspectRatio="none">
          <motion.line
            x1="0" y1="0" x2="0" y2="100%"
            stroke="#6366f1"
            strokeWidth="2"
            style={{ pathLength }}
          />
        </svg>

        <div className="space-y-24 md:space-y-40">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2">
                <div className="glass p-10 rounded-[40px] border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Award size={80} />
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{exp.period}</span>
                    <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {exp.metric}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-2">{exp.role}</h3>
                  <p className="text-lg text-slate-400 mb-6">{exp.company}</p>
                  
                  <p className="text-slate-500 leading-relaxed mb-8">{exp.impact}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {exp.stack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link to="/projects">
                    <Magnetic>
                      <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        View Case Study <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Magnetic>
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:flex w-1/2 justify-center">
                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] relative z-10">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const logos = [
    { name: "TechCrunch", icon: Globe },
    { name: "ProductHunt", icon: Rocket },
    { name: "HackerNews", icon: Terminal },
    { name: "SmashingMag", icon: Palette },
    { name: "JSWeekly", icon: Code2 }
  ];

  return (
    <section className="mb-40 py-20 border-y border-white/5">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-12">Trusted by Industry Leaders & Communities</p>
      <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
        {logos.map((logo, i) => (
          <div key={i} className="flex items-center gap-2 group cursor-pointer">
            <logo.icon size={24} className="group-hover:text-indigo-500 transition-colors" />
            <span className="font-bold tracking-tighter text-xl group-hover:text-white transition-colors">{logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Philosophy = () => {
  const points = [
    { title: "Delete-First Mentality", desc: "I don't write code I can't delete in 30 minutes. Modularity isn't a goal; it's a survival strategy." },
    { title: "Performance is UX", desc: "A beautiful UI that takes 3 seconds to load is a failure. I optimize for the first byte, not just the last pixel." },
    { title: "Radical Ownership", desc: "I don't just 'ship features.' I own the problem, the solution, the deployment, and the 3am pager call." }
  ];

  return (
    <section className="mb-40">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {points.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass p-10 rounded-[40px] border-white/5 hover:bg-white/[0.02] transition-colors"
          >
            <CheckCircle2 className="text-indigo-500 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
            <p className="text-slate-400 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NowSection = () => {
  return (
    <section className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="glass p-10 rounded-[40px] border-white/5">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <PlayCircle className="text-emerald-400" /> What I'm doing "Now"
        </h3>
        <ul className="space-y-4 text-slate-400">
          <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Deep diving into WebAssembly for edge computing.</li>
          <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Building a decentralized identity protocol.</li>
          <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Reading "The Pragmatic Programmer" for the 5th time.</li>
        </ul>
      </div>
      <div className="text-right">
        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white/5 select-none">GROWTH<br />MINDSET</h2>
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---

export default function About() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-guru-bg min-h-screen relative overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] orb-1 rounded-full blur-[120px] ambient-orb" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] orb-3 rounded-full blur-[120px] ambient-orb delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-40 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-40">
            <motion.div style={{ opacity, scale }} className="flex flex-col lg:flex-row items-end gap-12 mb-20">
              <div className="flex-1">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mb-6 block"
                >
                  {USER_DATA.role}
                </motion.span>
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] mb-8">
                  <TextDecode text="Building Robust" className="block" />
                  <span className="text-gradient">Systems for the Future</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed">
                  I architect resilient systems for modern platforms, focusing on <span className="text-white font-medium">backend logic</span>, <span className="text-white font-medium">database design</span>, and <span className="text-white font-medium">performance</span>.
                </p>
              </div>
              
              <div className="w-full lg:w-96">
                <AuroraPhoto />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <div className="space-y-12">
                <h2 className="text-4xl font-bold tracking-tight">The Narrative</h2>
                <StoryBeats />
              </div>
              
              <div className="sticky top-32">
                <Philosophy />
              </div>
            </div>
          </section>

          <SocialProof />

          <ProvenSkills />

          <ExperienceTimeline />

          <NowSection />

          {/* Final CTA */}
          <section className="py-40 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
                Let's build something that <span className="text-gradient italic">shouldn't work</span> (but does).
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link to="/contact">
                  <Magnetic>
                    <button className="px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-2xl shadow-white/10 flex items-center gap-3 group">
                      Hire Me <Sparkles size={20} className="text-indigo-500 group-hover:rotate-12 transition-transform" />
                    </button>
                  </Magnetic>
                </Link>
                
                <button 
                  onClick={() => document.getElementById('proven-skills')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full md:w-auto"
                >
                  <Magnetic>
                    <div className="px-12 py-6 glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 cursor-pointer">
                      View My Stack <Terminal size={20} />
                    </div>
                  </Magnetic>
                </button>
              </div>

              <div className="mt-20 flex justify-center gap-8 text-slate-500">
                <a href={USER_DATA.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Github size={18} /> GitHub</a>
                <a href={USER_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Linkedin size={18} /> LinkedIn</a>
                <a href={USER_DATA.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Twitter size={18} /> Twitter</a>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </motion.main>
  );
}
