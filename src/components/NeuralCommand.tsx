import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NeuralCommand() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Welcome to Neural Command. Type "help" for options.']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Record<string, () => void> = {
    help: () => setHistory(prev => [...prev, 'Available: projects, skills, contact, about, clear, help']),
    projects: () => {
      setHistory(prev => [...prev, 'Navigating to Projects...']);
      setTimeout(() => navigate('/projects'), 500);
    },
    skills: () => {
      setHistory(prev => [...prev, 'Scrolling to Skills...']);
      const el = document.getElementById('skills-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    },
    contact: () => {
      setHistory(prev => [...prev, 'Navigating to Contact...']);
      setTimeout(() => navigate('/contact'), 500);
    },
    about: () => {
      setHistory(prev => [...prev, 'Navigating to About...']);
      setTimeout(() => navigate('/about'), 500);
    },
    clear: () => setHistory([]),
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;

    setHistory(prev => [...prev, `> ${cmd}`]);
    setCommandHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);

    if (commands[cmd]) {
      commands[cmd]();
    } else {
      setHistory(prev => [...prev, `Unknown command: ${cmd}. Type "help" for list.`]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = Object.keys(commands).filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-80 glass rounded-3xl mb-4 overflow-hidden flex flex-col p-4 shadow-2xl border-indigo-500/20"
          >
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-400 mask-fade-bottom">
              {history.map((line, i) => (
                <div key={i} className={line.startsWith('>') ? 'text-indigo-400' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleCommand}
        className={`glass rounded-2xl flex items-center px-4 transition-all duration-300 ${
          isOpen ? 'w-80 h-12 border-indigo-500/50' : 'w-12 h-12 hover:w-48'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-shrink-0 text-indigo-400"
        >
          <Terminal size={18} />
        </button>
        
        <AnimatePresence>
          {(isOpen || input) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex items-center ml-2"
            >
              <span className="text-indigo-500 mr-1 font-mono text-sm tracking-tighter">_</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isOpen ? "Type command..." : "Neural Command"}
                className="bg-transparent border-none outline-none text-sm font-mono text-slate-200 w-full placeholder:text-slate-600"
              />
              <ChevronRight size={14} className="text-slate-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
