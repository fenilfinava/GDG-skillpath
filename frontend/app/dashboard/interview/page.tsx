"use client";
import { interviewQuestions } from '@/lib/mock-data';
import { useState } from 'react';
import { Mic, MessageSquare, Code, Play, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewPrepHub() {
  const [activeTab, setActiveTab] = useState('Technical');
  const tabs = ['Technical', 'Behavioral', 'System Design'];

  const filteredQuestions = interviewQuestions.filter(q => 
    activeTab === 'System Design' ? q.topic === 'System Design' : q.type === activeTab
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Interview Prep Hub</h2>
          <p className="text-slate-400 text-lg">Practice role-specific questions and take AI mock interviews.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:scale-[1.02]">
          <Play className="w-5 h-5 fill-current" /> Start AI Mock Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] transition-all group relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 relative z-10">
            <Code className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">DSA Tracker</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">You've solved 45/150 recommended problems.</p>
          <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner relative z-10">
            <div className="absolute inset-0 bg-blue-500 rounded-full" style={{ width: '30%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 blur-[2px] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.1)] transition-all group relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-colors border border-sky-500/20 relative z-10">
            <MessageSquare className="w-7 h-7 text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">Text Interviews</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">Avg. Score: 78/100 across 3 sessions.</p>
          <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner relative z-10">
            <div className="absolute inset-0 bg-sky-500 rounded-full" style={{ width: '78%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 blur-[2px] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl opacity-60 relative overflow-hidden group transition-opacity">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-400 rounded-lg border border-slate-700 tracking-wide uppercase">Coming Phase 3</div>
          <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 relative z-10">
            <Mic className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-300 mb-2 tracking-tight relative z-10">Voice Interviews</h3>
          <p className="text-slate-500 text-sm font-medium relative z-10">Real-time voice-based AI interviewer.</p>
        </motion.div>
      </div>

      <div className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="flex border-b border-white/5 bg-white/[0.02] relative z-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-5 text-sm font-bold transition-colors border-b-2 tracking-wide",
                activeTab === tab 
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 shadow-[inset_0_-2px_10px_rgba(59,130,246,0.1)]" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {filteredQuestions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 text-slate-500">
                <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-30 text-blue-400" />
                <p className="text-lg">No questions available for this category yet.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredQuestions.map((q, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={q.id} 
                    className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors duration-700 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                      <span className="text-xs px-3 py-1 bg-white/10 text-slate-300 rounded-lg font-bold tracking-wider uppercase border border-white/5">{q.topic}</span>
                      <span className={cn(
                        "text-xs px-3 py-1 rounded-lg font-bold border tracking-wider uppercase shadow-sm",
                        q.difficulty === 'Hard' ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]" :
                        q.difficulty === 'Medium' ? "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" :
                        "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                      )}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-6 leading-relaxed">{q.question}</h4>
                    <div className="flex justify-end gap-3">
                      <button className="text-sm font-bold text-slate-400 hover:text-white px-5 py-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all">View Answer</button>
                      <button className="text-sm font-bold bg-white/10 border border-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition-all shadow-md group-hover:shadow-lg">Practice</button>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
