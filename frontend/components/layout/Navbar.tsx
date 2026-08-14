"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Command } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { CommandPalette } from '@/components/ui/CommandPalette';

const TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/resume': 'Resume Review',
  '/dashboard/skill-gap': 'Skill Gap',
  '/dashboard/roadmap': 'My Roadmap',
  '/dashboard/interview': 'Interview Prep',
  '/dashboard/progress': 'Progress',
  '/dashboard/settings': 'Settings',
};

export default function Navbar({ title }: { title?: string }) {
  const pathname = usePathname();
  const activeTitle = title || TITLES[pathname] || 'Dashboard';
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
        className="h-20 flex items-center justify-between px-6 mx-8 mt-4 rounded-2xl bg-[#0A0D14]/80 backdrop-blur-2xl sticky top-4 z-40 border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight text-white mb-0.5">{activeTitle}</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Dashboard / {activeTitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setIsPaletteOpen(true)}
            className="relative hidden md:flex group items-center cursor-pointer"
          >
            <Search className="w-4 h-4 absolute left-4 text-slate-500 group-hover:text-white transition-colors" />
            <div 
              className="bg-[#111622]/80 backdrop-blur-md border border-white/10 group-hover:border-blue-500/40 rounded-xl pl-11 pr-14 py-2 text-sm w-72 text-slate-400 font-medium transition-all shadow-md flex items-center justify-between"
            >
              <span>Search commands...</span>
            </div>
            <div className="absolute right-3 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
               <Command className="w-3 h-3 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase">K</span>
            </div>
          </div>
          
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-[#111622]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white shadow-md cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
          </button>
        </div>
      </motion.header>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}
