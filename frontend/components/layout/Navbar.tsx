"use client";
import { useState, useEffect } from 'react';
import { Bell, Search, Command } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function Navbar({ title }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 }
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-28 flex items-center justify-between px-8 bg-[#030712]/70 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5 shadow-xl"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">{title}</h1>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Dashboard / {title}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setIsPaletteOpen(true)}
            className="relative hidden md:flex group items-center cursor-pointer"
          >
            <Search className="w-4 h-4 absolute left-4 text-slate-500 group-hover:text-white transition-colors" />
            <div 
              className="bg-[#111111]/80 backdrop-blur-md border border-white/5 group-hover:border-white/20 rounded-2xl pl-11 pr-14 py-3 text-sm w-72 text-slate-400 font-medium transition-all shadow-xl flex items-center justify-between"
            >
              <span>Search commands...</span>
            </div>
            <div className="absolute right-3 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
               <Command className="w-3 h-3 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase">K</span>
            </div>
          </div>
          
          <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-[#111111]/80 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-slate-400 hover:text-white shadow-xl cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
          </button>
        </div>
      </motion.header>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}
