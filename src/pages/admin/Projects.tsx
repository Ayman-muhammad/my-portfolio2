import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GripVertical, Eye, Edit, Trash2, Plus, Save, X, Image as ImageIcon, Link as LinkIcon, Code, Layout, Globe, Github as GithubIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { Project } from '../../types';

interface SortableItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

function SortableProjectItem({ project, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-3 transition-all ${
        isDragging ? 'opacity-50 scale-[1.02] border-indigo-500/50 shadow-2xl shadow-indigo-500/20' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-white/5 rounded-lg cursor-grab active:cursor-grabbing text-slate-500 hover:text-white transition-colors"
        >
          <GripVertical size={20} />
        </button>
        
        <div className="w-16 h-12 bg-slate-800 rounded-xl overflow-hidden border border-white/5">
          {project.thumbnail_url && (
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        
        <div>
          <h3 className="font-bold text-slate-200">{project.title}</h3>
          <p className="text-xs text-slate-500">{project.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-1 text-slate-500 text-sm">
          <Eye size={14} /> {project.views}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  async function saveOrder() {
    setSaving(true);
    try {
      const orders = projects.map((p, index) => ({
        id: p.id,
        order_index: index,
      }));

      const res = await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });

      if (res.ok) {
        setHasChanges(false);
      } else {
        alert('Failed to save order');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving order');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert('Error deleting project: ' + error.message);
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  }

  async function handleUpdateProject(updatedProject: Project) {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Projects</h2>
          <p className="text-slate-400">Drag and drop to reorder your portfolio projects.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {hasChanges && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={saveOrder}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Order'}
            </motion.button>
          )}
          
          <Link 
            to="/admin/projects/new"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            New Project
          </Link>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <p className="text-slate-500 mb-4">No projects found. Start by creating one!</p>
            <Link 
              to="/admin/projects/new"
              className="inline-flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
            >
              Create First Project
            </Link>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {projects.map((project) => (
                  <SortableProjectItem 
                    key={project.id} 
                    project={project} 
                    onEdit={setEditingProject}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AnimatePresence>
        {editingProject && (
          <EditProjectModal 
            project={editingProject} 
            onClose={() => setEditingProject(null)} 
            onSave={handleUpdateProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
}

function EditProjectModal({ project, onClose, onSave }: EditProjectModalProps) {
  const [formData, setFormData] = useState<Project>({ ...project });
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const { data } = await res.json();
        onSave(data);
      } else {
        const err = await res.json();
        alert('Failed to save project: ' + err.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...(formData.tech_stack || []), techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack?.filter(t => t !== tech) || []
    });
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images?.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const removeImage = (url: string) => {
    setFormData({
      ...formData,
      images: formData.images?.filter(img => img !== url) || []
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl bg-guru-bg border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Edit size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Edit Project</h3>
              <p className="text-xs text-slate-500">Modify project details and case study.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Project Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Slug (URL path)</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tagline</label>
                <input 
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>

            {/* Links & Status */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Live URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="url"
                    value={formData.live_url || ''}
                    onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">GitHub URL</label>
                <div className="relative">
                  <GithubIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="url"
                    value={formData.github_url || ''}
                    onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${
                    formData.featured 
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                      : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  <Sparkles size={18} />
                  Featured Project
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description (Short Summary)</label>
            <textarea 
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
            />
          </div>

          {/* Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Thumbnail URL</label>
              <div className="space-y-4">
                <input 
                  type="url"
                  value={formData.thumbnail_url || ''}
                  onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Image URL..."
                />
                {formData.thumbnail_url && (
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <img src={formData.thumbnail_url} alt="Thumbnail Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tech Stack</label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                    placeholder="Add technology..."
                  />
                  <button 
                    type="button"
                    onClick={addTech}
                    className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack?.map(tech => (
                    <span key={tech} className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-bold">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="hover:text-white">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Gallery Images</label>
            <div className="space-y-6">
              <div className="flex gap-2">
                <input 
                  type="url"
                  value={imageInput}
                  onChange={e => setImageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="Add image URL..."
                />
                <button 
                  type="button"
                  onClick={addImage}
                  className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case Study Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Case Study Content (Markdown)</label>
            <textarea 
              rows={15}
              value={formData.content || ''}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-sm leading-relaxed"
              placeholder="# Project Overview..."
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex items-center justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-slate-400 font-bold hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="px-10 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl shadow-indigo-500/20"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
