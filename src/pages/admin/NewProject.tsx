import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, X, Plus, Save, Loader2, Globe, Github, Sparkles, Type, Link as LinkIcon, Image as ImageIcon, Layout, Code2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { Project } from '../../types';

export default function NewProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    thumbnail_url: '',
    images: [] as string[],
    tech_stack: [] as string[],
    live_url: '',
    github_url: '',
    featured: false,
    content: '',
  });

  const [newTech, setNewTech] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      
      // Auto-generate slug from title if slug is empty or matches previous title-slug
      if (name === 'title' && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))) {
        newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      
      return newData;
    });
  };

  const addTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
      if (!formData.tech_stack.includes(newTech.trim())) {
        setFormData(prev => ({
          ...prev,
          tech_stack: [...prev.tech_stack, newTech.trim()]
        }));
      }
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter(t => t !== tech)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (isThumbnail) {
        setFormData(prev => ({ ...prev, thumbnail_url: uploadedUrls[0] }));
      } else {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabase();
    if (!supabase) return;

    try {
      // Get max order_index
      const { data: maxOrderData } = await supabase
        .from('projects')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1);
      
      const nextOrderIndex = maxOrderData && maxOrderData.length > 0 ? (maxOrderData[0].order_index + 1) : 0;

      const { error: insertError } = await supabase
        .from('projects')
        .insert([{
          ...formData,
          order_index: nextOrderIndex,
          views: 0
        }]);

      if (insertError) throw insertError;

      navigate('/admin/projects');
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/projects"
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">New Project</h1>
            <p className="text-slate-400">Add a new masterpiece to your portfolio.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || uploading}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all disabled:opacity-50 shadow-2xl shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
          <X size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Type size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Project Title</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Neural Command"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Slug</label>
                  <input
                    required
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="neural-command"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Tagline</label>
                  <input
                    required
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Short punchy description"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell the story of this project..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200 resize-none"
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Case Study Content</h2>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Content (Markdown)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                placeholder="Write the full case study here..."
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200 font-mono text-sm"
              />
            </div>
          </section>

          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-indigo-400" />
                <h2 className="text-xl font-bold">Gallery</h2>
              </div>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Add Images
              </button>
            </div>

            <input
              type="file"
              ref={galleryInputRef}
              onChange={(e) => handleFileUpload(e, false)}
              multiple
              accept="image/*"
              className="hidden"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((url, i) => (
                <div key={i} className="relative group aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-indigo-400"
              >
                <Upload size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Upload Images</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Layout size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Thumbnail</h2>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-white/10 hover:border-indigo-500/30 hover:bg-white/5 transition-all cursor-pointer group"
            >
              {formData.thumbnail_url ? (
                <>
                  <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="text-white" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Upload Thumbnail</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-400" size={32} />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, true)}
              accept="image/*"
              className="hidden"
            />
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">Recommended: 1200x800px</p>
          </section>

          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Code2 size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Tech Stack</h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={addTech}
                placeholder="Add tech (Press Enter)"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200 text-sm"
              />
              
              <div className="flex flex-wrap gap-2">
                {formData.tech_stack.map(tech => (
                  <span 
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-400"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="glass rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon size={20} className="text-indigo-400" />
              <h2 className="text-xl font-bold">Links & Visibility</h2>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleInputChange}
                  placeholder="Live Demo URL"
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200 text-sm"
                />
              </div>

              <div className="relative group">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleInputChange}
                  placeholder="GitHub Repository"
                  className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-slate-200 text-sm"
                />
              </div>

              <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-amber-400" />
                  <span className="text-sm font-bold">Featured Project</span>
                </div>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500"
                />
              </label>
            </div>
          </section>
        </div>
      </form>
    </motion.div>
  );
}
