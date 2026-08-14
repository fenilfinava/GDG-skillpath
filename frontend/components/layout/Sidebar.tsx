"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Target, Map, Video, Settings, BookOpen, BrainCircuit, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { useResume } from '@/lib/ResumeContext';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/resume', label: 'Upload Resume', icon: FileText },
  { href: '/dashboard/skill-gap', label: 'Skill Gap', icon: Target },
  { href: '/dashboard/roadmap', label: 'My Roadmap', icon: Map },
  { href: '/dashboard/interview', label: 'Interview Prep', icon: Video },
  { href: '/dashboard/progress', label: 'Progress', icon: BookOpen },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { hasData, userName: contextUserName, targetRole: contextTargetRole } = useResume();

  const handleLogout = () => {
    localStorage.removeItem('skillpath_token');
    localStorage.removeItem('skillpath_user');
    router.push('/login');
  };

  const userName = contextUserName || 'Developer User';
  const userRole = contextTargetRole || 'Pro Member';
  const avatarSeed = encodeURIComponent(userName);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}
      <motion.aside 
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "w-[280px] h-[calc(100vh-32px)] fixed left-4 top-4 z-50 flex flex-col bg-[#0A0D14]/95 lg:bg-[#0A0D14]/80 backdrop-blur-3xl border border-white/[0.05] rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
        )}
        onMouseLeave={() => setHoveredIndex(null)}
      >
      {/* Glossy top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="h-24 flex items-center px-8">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
             {/* Glowing aura */}
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-all duration-500">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SkillPath</span>
        </Link>
      </div>
      
      <div className="px-6 pb-2">
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80 mb-2 px-2">Main Menu</p>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 relative z-10 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          
          let displayLabel = item.label;
          if (item.href === '/dashboard/resume' && hasData) {
            displayLabel = 'Update Resume';
          }
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              className={cn(
                "relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 group",
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {hoveredIndex === index && !isActive && (
                <motion.div
                  layoutId="hoverTab"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.02] rounded-2xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {/* Custom active indicator line */}
              {isActive && (
                 <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-[25%] bottom-[25%] w-[3px] bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                 />
              )}
              <Icon className={cn("w-5 h-5 relative z-10 transition-colors duration-300", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="relative z-10">{displayLabel}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t border-white/[0.02] bg-black/20">
        <div className="flex items-center justify-between gap-1 mb-2">
          <Link href="/dashboard/settings" className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              <span className="text-[13px] font-semibold text-slate-400 group-hover:text-white transition-colors">Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1 px-2.5 py-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer" title="Sign Out">
              <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}&backgroundColor=transparent`} 
            alt={userName} 
            className="w-9 h-9 rounded-xl bg-white/10 shrink-0" 
           />
           <div className="relative z-10 min-w-0 flex-1">
            <p className="text-[13px] font-bold text-white leading-tight truncate">{userName}</p>
            <p className="text-[11px] font-semibold text-blue-400 leading-tight mt-0.5 truncate">{userRole}</p>
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
}
