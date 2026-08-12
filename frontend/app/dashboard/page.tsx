"use client";
import { mockUser, skillGaps } from '@/lib/mock-data';
import { Target, Flame, Clock, Award, ArrowRight, BookOpen, Code2, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <div className="max-w-7xl mx-auto space-y-10 pb-10">
      
      {/* ──────────────── HEADER ──────────────── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-2 mb-8 relative"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 w-max mb-4">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">{mockUser.streak} Day Learning Streak</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
          Welcome back, {mockUser.name.split(' ')[0]}.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mt-2 font-medium">
          You're on track to become a <span className="text-blue-400 font-bold">{mockUser.targetRole}</span>. Keep up the momentum.
        </p>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* ──────────────── NEXT UP (Main Hero Card) ──────────────── */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="h-full bg-[#030712]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2rem] p-8 relative overflow-hidden group transition-all duration-500 shadow-2xl flex flex-col justify-between">
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]"></div>
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
            
            <div className="relative z-10 mt-auto">
              <span className="text-xs font-black px-3 py-1 uppercase tracking-widest bg-blue-500/20 text-blue-300 rounded-md mb-4 inline-block">Hands-on Project</span>
              <h4 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Build a REST API with Node</h4>
              <p className="text-slate-400 text-lg mb-8 max-w-xl leading-relaxed">Apply your backend knowledge by building a scalable API with Express and PostgreSQL. Includes authentication and rate limiting.</p>
              
              <Link href="/dashboard/roadmap">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#030712] hover:bg-slate-200 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Jump back in <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ──────────────── READINESS SCORE ──────────────── */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <div className="h-full bg-[#030712]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[2rem] p-8 relative overflow-hidden group transition-all duration-500 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-600/20 transition-colors duration-700"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 shadow-lg">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-8">Interview Readiness</h3>
              
              <div className="relative w-48 h-48 mb-8">
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
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{mockUser.readinessScore}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              
              <p className="text-sm font-medium text-slate-400 px-4">
                You need a score of <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded ml-1">85+</span> to be interview ready.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ──────────────── SKILL GAPS (Bottom Section) ──────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-12"
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-orange-400" /> Priority Skill Gaps
            </h3>
            <p className="text-slate-400 text-base mt-2">Close these gaps to dramatically increase your readiness score.</p>
          </div>
          <Link href="/dashboard/skill-gap">
            <button className="text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
              View Detailed Analysis <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGaps.slice(0, 4).map((skill, i) => (
            <motion.div variants={itemVariants} key={skill.id} className="bg-[#030712]/40 backdrop-blur-md border border-white/10 hover:border-white/20 p-6 rounded-[1.5rem] group transition-all duration-300 relative overflow-hidden shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none"></div>
              
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
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 shadow-[0_0_10px_rgba(255,255,255,1)]" style={{ left: `${skill.targetLevel}%` }}></div>
                  <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full relative" style={{ width: `${skill.currentLevel}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
