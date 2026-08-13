"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, FileText, Map, PieChart, TrendingUp, Settings, Video, Sparkles, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigationItems = [
    { label: 'Overview', route: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Resume Parser', route: '/dashboard/resume', icon: FileText, category: 'Navigation' },
    { label: 'Skill Roadmap', route: '/dashboard/roadmap', icon: Map, category: 'Navigation' },
    { label: 'Skill Gap Analysis', route: '/dashboard/skill-gap', icon: PieChart, category: 'Navigation' },
    { label: 'Progress Tracking', route: '/dashboard/progress', icon: TrendingUp, category: 'Navigation' },
    { label: 'Mock Interview Hub', route: '/dashboard/interview', icon: Video, category: 'Navigation' },
    { label: 'Settings', route: '/dashboard/settings', icon: Settings, category: 'Navigation' },
    { label: 'AI Resume Optimization', route: '/dashboard/resume', icon: Sparkles, category: 'AI Actions' },
    { label: 'Generate Skill Gap Report', route: '/dashboard/skill-gap', icon: Sparkles, category: 'AI Actions' },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setSearch('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (route: string) => {
    router.push(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-0"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl bg-[#0b0f19]/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-2xl text-left"
          >
            {/* Search Bar Input */}
            <div className="flex items-center px-6 py-4 border-b border-white/10 relative">
              <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search page..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-white placeholder-slate-500 font-medium focus:outline-none text-base"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">
                  No command or page found for "{search}"
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item.route)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all font-medium text-left ${
                        isSelected 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-xl border ${
                          item.category === 'AI Actions' 
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{item.category}</div>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0 opacity-100 text-blue-400' : '-translate-x-2 opacity-0'}`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">↑↓</span> to navigate
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] ml-2">↵</span> to select
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">ESC</span> to close
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
