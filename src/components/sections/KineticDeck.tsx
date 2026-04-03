import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Layers } from 'lucide-react';

const images = [
  { id: 1, url: 'https://picsum.photos/seed/kinetic1/800/1000', title: 'System Architecture' },
  { id: 2, url: 'https://picsum.photos/seed/kinetic2/800/1000', title: 'Visual Design' },
  { id: 3, url: 'https://picsum.photos/seed/kinetic3/800/1000', title: 'Code Quality' },
];

export default function KineticDeck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 glass rounded-3xl flex items-center justify-center mb-6 text-indigo-500"
          >
            <Layers size={32} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-6"
          >
            Kinetic <span className="text-gradient">Deck</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl text-lg"
          >
            Interact with my core principles. Drag, flip, and explore the layers of my engineering philosophy.
          </motion.p>
        </div>

        <div className="relative h-[600px] flex items-center justify-center perspective-1000">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              drag
              dragConstraints={containerRef}
              initial={{ 
                opacity: 0, 
                rotateZ: 0, 
                x: 0, 
                y: 0,
                scale: 0.8
              }}
              animate={isInView ? {
                opacity: 1,
                rotateZ: (i - 1) * 15,
                x: (i - 1) * 200,
                y: Math.abs(i - 1) * 20,
                scale: 1,
              } : {}}
              whileHover={{ 
                scale: 1.1, 
                zIndex: 50,
                rotateZ: 0,
                transition: { duration: 0.3 }
              }}
              whileDrag={{ scale: 1.05, zIndex: 100 }}
              transition={{ 
                delay: i * 0.2, 
                duration: 1, 
                ease: [0.22, 1, 0.36, 1],
                type: 'spring',
                stiffness: 100,
                damping: 20
              }}
              className="absolute w-64 md:w-80 aspect-[4/5] cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-full h-full preserve-3d group transition-transform duration-700">
                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 block">Principle 0{img.id}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{img.title}</h3>
                  </div>
                </div>
                
                {/* Back (Flip effect) */}
                <div className="absolute inset-0 backface-hidden rounded-[32px] glass flex flex-col items-center justify-center p-8 text-center rotate-y-180">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                    <Layers size={20} className="text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{img.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Detailed insight into this core principle and how it shapes every line of code I write.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
