"use client";
import { useState } from 'react';
import { Bell, Search, Command } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar({ title }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
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
        <div className="relative hidden md:flex group items-center">
          <Search className="w-4 h-4 absolute left-4 text-slate-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-2xl pl-11 pr-14 py-3 text-sm focus:outline-none focus:border-white/20 w-72 text-white transition-all placeholder:text-slate-600 shadow-xl"
          />
          <div className="absolute right-3 flex items-center gap-1 opacity-50">
             <Command className="w-3 h-3 text-slate-400" />
             <span className="text-[10px] font-bold text-slate-400">K</span>
          </div>
        </div>
        
        <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-[#111111]/80 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-slate-400 hover:text-white shadow-xl">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
        </button>
      </div>
    </motion.header>
  );
}
