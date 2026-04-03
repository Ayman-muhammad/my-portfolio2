import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Eye, ArrowRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../lib/supabase';
import { Project } from '../types';

import { USER_DATA } from '../constants';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchProjects() {
      const supabase = getSupabase();
      if (!supabase) {
        setProjects(USER_DATA.fallbackProjects as Project[]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(USER_DATA.fallbackProjects as Project[]);
      }
      setLoading(false);
    }

    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.tech_stack?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || p.tech_stack?.some(t => t.toLowerCase() === filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', ...new Set(projects.flatMap(p => p.tech_stack || []))].slice(0, 8);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-guru-bg min-h-screen pt-32 pb-32"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-20">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8"
          >
            Archive of <br />
            <span className="text-gradient">Innovations</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 leading-relaxed max-w-2xl"
          >
            A comprehensive look at the systems, platforms, and experiments I've built over the years.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === cat 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden rounded-[32px] bg-slate-900 border border-white/5">
                  <img
                    src={project.thumbnail_url || `https://picsum.photos/seed/${project.slug}/1200/800`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Hover Overlay */}
                  <Link 
                    to={`/projects/${project.slug}`}
                    className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/20 backdrop-blur-sm"
                  >
                    <div className="px-8 py-3 rounded-full bg-white text-slate-950 font-bold flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform duration-500">
                      View Case Study <ArrowRight size={18} />
                    </div>
                  </Link>
                </div>
                
                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                      <Eye size={14} /> {project.views?.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-slate-400 text-lg leading-relaxed">{project.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map(t => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-slate-500 text-xl">No projects found matching your criteria.</p>
            <button onClick={() => { setSearch(''); setFilter('all'); }} className="mt-6 text-indigo-400 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </motion.main>
  );
}
