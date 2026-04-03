import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { Project } from '../../types';

import { USER_DATA } from '../../constants';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
        .eq('featured', true)
        .order('order_index', { ascending: true });

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(USER_DATA.fallbackProjects as Project[]);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-32 container mx-auto px-6">
      <div className="flex items-end justify-between mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">Selected Works</h2>
          <p className="text-slate-400 max-w-md text-lg">
            A curated collection of projects where technical complexity meets aesthetic excellence.
          </p>
        </motion.div>
        <Link to="/projects" className="hidden md:flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
          View All Projects 
          <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-guru-surface border border-guru-border">
              <img
                src={project.thumbnail_url || `https://picsum.photos/seed/${project.slug}/800/1000`}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-guru-bg via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack?.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-bold text-text-primary tracking-tight mb-2">
                  {project.title}
                </h3>
              </div>
              
              {/* Hover Overlay */}
              <Link 
                to={`/projects/${project.slug}`}
                className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-accent-indigo/20 backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full bg-text-primary text-guru-bg flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                  <ArrowRight size={24} />
                </div>
              </Link>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <p className="text-text-secondary font-medium">{project.tagline}</p>
              <div className="flex items-center gap-1 text-text-muted text-xs font-mono">
                <Eye size={14} /> {project.views?.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
