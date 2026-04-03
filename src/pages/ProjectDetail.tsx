import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Eye, Calendar, Layers, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { getSupabase } from '../lib/supabase';
import { Project } from '../types';

import { USER_DATA } from '../constants';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    async function fetchProject() {
      const supabase = getSupabase();
      if (!supabase || !slug) {
        const fallback = USER_DATA.fallbackProjects.find(p => p.slug === slug);
        setProject(fallback as Project || null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setProject(data);
        // Increment views
        await supabase
          .from('projects')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id);
      } else {
        const fallback = USER_DATA.fallbackProjects.find(p => p.slug === slug);
        setProject(fallback as Project || null);
      }
      setLoading(false);
    }

    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-guru-bg">
        <div className="w-16 h-16 border-4 border-accent-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-guru-bg px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-text-secondary mb-8">The project you're looking for doesn't exist or has been moved.</p>
        <Link to="/projects" className="px-8 py-4 bg-accent-indigo rounded-xl font-bold">Back to Projects</Link>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-guru-bg min-h-screen pb-32"
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src={project.thumbnail_url || `https://picsum.photos/seed/${project.slug}/1920/1080`}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-20">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/projects" className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-8 hover:gap-3 transition-all">
                <ArrowLeft size={20} /> Back to Projects
              </Link>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">{project.title}</h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed">
                {project.tagline}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={24} className="text-indigo-400" />
                <h2 className="text-3xl font-bold tracking-tight !mb-0">Case Study</h2>
              </div>
              
              <div className="text-slate-400 leading-relaxed mb-12">
                {project.description}
              </div>

              {project.content && (
                <div className="markdown-body">
                  <Markdown>{project.content}</Markdown>
                </div>
              )}
            </motion.div>

            {/* Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="mt-20 space-y-10">
                <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                {project.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="rounded-[32px] overflow-hidden border border-white/5"
                  >
                    <img src={img} alt={`${project.title} screenshot ${i}`} className="w-full h-auto" referrerPolicy="no-referrer" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[32px] sticky top-32"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <Layers size={14} /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <Calendar size={14} /> Year
                    </h3>
                    <p className="text-slate-200">2024</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <Eye size={14} /> Views
                    </h3>
                    <p className="text-slate-200">{project.views?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-400 transition-colors"
                    >
                      Live Preview <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      Source Code <Github size={18} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
