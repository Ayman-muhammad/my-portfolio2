import { motion } from 'motion/react';
import { Mail, Github, Linkedin, Twitter, Send, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { USER_DATA } from '../constants';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20 container mx-auto px-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Let's build <br /> something <span className="text-indigo-500">epic</span>.</h1>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-md">
            Have a project in mind or just want to chat about tech? 
            I'm always open to interesting collaborations.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                <Mail className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Email</p>
                <p className="text-lg font-medium">{USER_DATA.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                <Phone className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Phone</p>
                <p className="text-lg font-medium">+254 722 251 333</p>
              </div>
            </div>

            <div className="flex gap-4">
              {[
                { Icon: Github, href: USER_DATA.socials.github },
                { Icon: Linkedin, href: USER_DATA.socials.linkedin },
                { Icon: Twitter, href: USER_DATA.socials.twitter }
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-indigo-500/50 transition-all"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                placeholder="Tell me about your project..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
            >
              {status === 'loading' ? 'Sending...' : (
                <>
                  Send Message
                  <Send size={18} />
                </>
              )}
            </button>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-center font-bold"
              >
                Message sent successfully!
              </motion.p>
            )}
          </form>
        </div>
      </div>
    </motion.main>
  );
}
