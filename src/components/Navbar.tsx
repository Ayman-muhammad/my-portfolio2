import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Menu, X, Github, Linkedin, Twitter, Command } from 'lucide-react';
import { USER_DATA } from '../constants';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-700 ${scrolled ? 'py-4' : 'py-10'}`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between glass rounded-[32px] px-8 py-4 transition-all duration-700 ${scrolled ? 'shadow-2xl shadow-black/50 border-white/10 bg-slate-950/80' : 'bg-transparent border-transparent'}`}>
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3 group relative">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10"
          >
            <span className="text-white font-black text-xl">{USER_DATA.name.charAt(0)}</span>
          </motion.div>
          
          {/* Rotating Ayman Text around Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -left-2 -top-2 w-14 h-14 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path id="logoPath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
              </defs>
              <text className="text-[8px] font-bold uppercase tracking-[0.2em] fill-indigo-400">
                <textPath xlinkHref="#logoPath">
                  AYMAN • AYMAN •
                </textPath>
              </text>
            </svg>
          </motion.div>

          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-bold tracking-tight">{USER_DATA.name.split(' ')[0]}<span className="text-indigo-500">.</span></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hidden sm:block">Portfolio</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-slate-500'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="h-6 w-px bg-white/10" />
          
          <div className="flex items-center gap-5">
            <a href={USER_DATA.socials.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors"><Github size={18} /></a>
            <a href={USER_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={18} /></a>
            
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all"
              >
                Hire Me
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-command-palette'))}
            >
              <Command size={18} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white w-10 h-10 flex items-center justify-center glass rounded-xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Scroll Progress */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent origin-center"
        style={{ scaleX }}
      />

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-28 left-6 right-6 glass rounded-3xl p-8 md:hidden z-50"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-2xl font-bold tracking-tight transition-colors ${
                    location.pathname === link.path ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10" />
              <div className="flex items-center gap-6">
                <a href={USER_DATA.socials.github} className="text-slate-400 hover:text-white"><Github size={24} /></a>
                <a href={USER_DATA.socials.linkedin} className="text-slate-400 hover:text-white"><Linkedin size={24} /></a>
                <a href={USER_DATA.socials.twitter} className="text-slate-400 hover:text-white"><Twitter size={24} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
