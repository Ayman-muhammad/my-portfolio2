import { motion } from 'motion/react';
import { Monitor, Keyboard, Mouse, Headphones, Coffee, Zap } from 'lucide-react';

const items = [
  { icon: Monitor, name: "32\" 4K Display", desc: "For pixel-perfect precision." },
  { icon: Keyboard, name: "Mechanical Deck", desc: "Custom switches for tactile feedback." },
  { icon: Mouse, name: "Ergo Mouse", desc: "Precision tracking for long sessions." },
  { icon: Headphones, name: "Studio Cans", desc: "Immersive sound for deep focus." },
  { icon: Coffee, name: "AeroPress", desc: "Fueling the creative process." },
  { icon: Zap, name: "Fiber Link", desc: "Zero latency, infinite possibilities." },
];

export default function MySetup() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-6"
          >
            The <span className="text-gradient">Command Center</span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            A glimpse into the environment where ideas turn into reality. Every tool is chosen for its ability to enhance the craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-[32px] border-white/5 group hover:border-indigo-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Hand-drawn element */}
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          className="absolute -bottom-10 -right-10 text-indigo-500/20 pointer-events-none hidden lg:block"
        >
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 50C100 100 200 100 250 50M250 50L230 60M250 50L240 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="100" y="150" fill="currentColor" className="font-handwriting text-4xl">Optimized for Flow</text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
