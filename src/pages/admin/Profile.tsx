import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, User, Camera, MapPin, Mail, Github, Linkedin, Twitter, Info } from 'lucide-react';
import { getSupabase } from '../../lib/supabase';
import { USER_DATA } from '../../constants';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = getSupabase();

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) {
        setProfile(USER_DATA);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setProfile(data);
        } else {
          // Initialize with constants if table is empty
          setProfile(USER_DATA);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfile(USER_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase not connected. Changes cannot be saved permanently.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profile')
        .upsert({ 
          id: profile.id || 1, // Assuming single profile record
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (key: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      photos: { ...prev.photos, [key]: value }
    }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      socials: { ...prev.socials, [key]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-slate-400">Manage your personal information and photos.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <Info size={20} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User size={20} className="text-indigo-400" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Role / Title</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <MapPin size={14} /> Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-slate-400">Short Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Camera size={20} className="text-emerald-400" /> Personal Photos
          </h3>
          <p className="text-sm text-slate-500 mb-6 italic">Enter the URLs for your photos. You can use services like Imgur or Cloudinary to host your images.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">Hero Photo URL</label>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <img src={profile.photos.hero} alt="Hero" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={profile.photos.hero}
                onChange={(e) => handlePhotoChange('hero', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">Portrait Photo URL</label>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <img src={profile.photos.portrait} alt="Portrait" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={profile.photos.portrait}
                onChange={(e) => handlePhotoChange('portrait', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">About Photo URL</label>
              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                <img src={profile.photos.about} alt="About" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={profile.photos.about}
                onChange={(e) => handlePhotoChange('about', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass p-8 rounded-3xl border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Github size={20} className="text-slate-400" /> Social Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Github size={14} /> GitHub URL
              </label>
              <input
                type="text"
                value={profile.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn URL
              </label>
              <input
                type="text"
                value={profile.socials.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Twitter size={14} /> Twitter URL
              </label>
              <input
                type="text"
                value={profile.socials.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
