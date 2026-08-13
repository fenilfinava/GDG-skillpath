"use client";
import { mockUser, skillGaps } from '@/lib/mock-data';
import { Target, Flame, Clock, Award, ArrowRight, BookOpen, Code2, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SpotlightTiltCard } from '@/components/ui/SpotlightTiltCard';
import { GlowingProgressBar } from '@/components/ui/GlowingProgressBar';

export default function DashboardOverview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 pb-10 items-start">
      
      {/* ──────────────── COLUMN 1: MAIN CONTENT (Center) ──────────────── */}
      <div className="space-y-10 flex-1 min-w-0">
        
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-2 relative"
        >
          {/* Mobile Streak Badge */}
          <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-max mb-2">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">{mockUser.streak} Day Learning Streak</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight text-left">
            Welcome back, {mockUser.name.split(' ')[0]}.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mt-2 font-medium text-left">
            You're on track to become a <span className="text-blue-400 font-bold">{mockUser.targetRole}</span>. Keep up the momentum.
          </p>
        </motion.header>

        {/* Mobile-only Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
          <SpotlightTiltCard 
            spotlightColor="rgba(139, 92, 246, 0.2)"
            className="bg-[#030712]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between"
          >
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Readiness</h3>
              <span className="text-3xl font-black text-white">{mockUser.readinessScore} <span className="text-xs text-slate-500">/ 100</span></span>
            </div>
            <div className="w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray={`${mockUser.readinessScore * 2.82} 282`} strokeLinecap="round" />
              </svg>
            </div>
          </SpotlightTiltCard>
        </div>

        {/* NEXT UP */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <SpotlightTiltCard 
            spotlightColor="rgba(59, 130, 246, 0.2)"
            variants={itemVariants} 
            className="w-full bg-[#030712]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between min-h-[350px]"
          >
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/30 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Focus</h3>
                  <p className="text-white font-medium">Next on your roadmap</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-sm font-semibold">
                <Clock className="w-4 h-4 text-blue-400" /> 15 hrs
              </div>
            </div>
            
            <div className="relative z-10 mt-auto text-left">
              <span className="text-xs font-black px-3 py-1 uppercase tracking-widest bg-blue-500/20 text-blue-300 rounded-md mb-4 inline-block">Hands-on Project</span>
              <h4 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Build a REST API with Node</h4>
              <p className="text-slate-400 text-lg mb-8 max-w-xl leading-relaxed">Apply your backend knowledge by building a scalable API with Express and PostgreSQL. Includes authentication and rate limiting.</p>
              
              <Link href="/dashboard/roadmap">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#030712] hover:bg-slate-200 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                  Jump back in <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </SpotlightTiltCard>
        </motion.div>

        {/* SKILL GAPS */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mt-12">
          <div className="flex justify-between items-end mb-8">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-400" /> Priority Skill Gaps
              </h3>
              <p className="text-slate-400 text-base mt-2">Close these gaps to dramatically increase your readiness score.</p>
            </div>
            <Link href="/dashboard/skill-gap">
              <button className="text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer">
                View Detailed Analysis <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGaps.slice(0, 4).map((skill, i) => (
              <SpotlightTiltCard 
                spotlightColor="rgba(59, 130, 246, 0.15)"
                variants={itemVariants} 
                key={skill.id} 
                className="bg-[#030712]/40 backdrop-blur-md border border-white/10 p-6 rounded-[1.5rem] shadow-xl text-left"
              >
                <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                      <Code2 className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 uppercase tracking-widest rounded-md ${
                      i === 0 ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-400'
                    }`}>
                      {skill.category}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-white text-lg mb-1">{skill.name}</h4>
                  
                  <div className="flex justify-between text-xs font-bold mb-3 mt-6 uppercase tracking-wider">
                    <span className="text-slate-500">Current: <span className="text-white">{skill.currentLevel}%</span></span>
                    <span className="text-slate-500">Goal: <span className="text-blue-400">{skill.targetLevel}%</span></span>
                  </div>
                  
                  <GlowingProgressBar 
                    value={skill.currentLevel}
                    targetValue={skill.targetLevel}
                    glowColor="rgba(59, 130, 246, 0.3)"
                  />
                </div>
              </SpotlightTiltCard>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ──────────────── COLUMN 2: METRICS PANEL (Right Sticky) ──────────────── */}
      <div className="hidden lg:flex flex-col gap-6 sticky top-28 w-full z-20">
        <SpotlightTiltCard 
          spotlightColor="rgba(139, 92, 246, 0.2)"
          className="bg-[#030712]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center text-center w-full"
        >
          <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 hover:opacity-40 transition-opacity"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 w-full flex flex-col items-center">
            {/* Streak Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-6 shadow-md">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">{mockUser.streak} Day Streak</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 shadow-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-6">Interview Readiness</h3>
            
            <div className="relative w-44 h-44 mb-6">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#score-gradient)" strokeWidth="6" strokeDasharray={`${mockUser.readinessScore * 2.82} 282`} className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" strokeLinecap="round" />
                <defs>
                  <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{mockUser.readinessScore}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            
            <p className="text-xs font-medium text-slate-400 px-4 leading-relaxed">
              Target Score: <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded ml-1">85+</span>
            </p>
          </div>
        </SpotlightTiltCard>

        {/* Quick Stats Widget */}
        <SpotlightTiltCard 
          spotlightColor="rgba(59, 130, 246, 0.15)"
          className="bg-[#030712]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col w-full text-left"
        >
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h4>
          <div className="flex flex-col gap-4 font-medium text-slate-300">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">DSA Solved</span>
              <span className="text-sm font-bold text-white">45 / 150</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">Mock Interviews</span>
              <span className="text-sm font-bold text-white">3 Sessions</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-slate-400">Avg. Score</span>
              <span className="text-sm font-bold text-blue-400">78 / 100</span>
            </div>
          </div>
        </SpotlightTiltCard>
      </div>

    </div>
  );
}
