import { motion } from 'motion/react';

export default function Signature({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="font-handwriting text-4xl md:text-5xl text-indigo-400/80 -rotate-6 select-none pointer-events-none"
    >
      {name}
    </motion.div>
  );
}
