"use client";
import { useState } from 'react';
import { Mic, MessageSquare, Code, Play, ShieldAlert, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewModal from '@/components/InterviewModal';
import { useResume } from '@/lib/ResumeContext';
import Link from 'next/link';

export default function InterviewPrepHub() {
  const { targetRole, summary, hasData, interviewScore } = useResume();
  const [activeTab, setActiveTab] = useState('Technical');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabs = ['Technical', 'Behavioral', 'System Design'];

  // Empty state: no resume uploaded yet
  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8">
          <FileText className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Interview Prep Locked</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md">Upload your resume first so our AI interviewer can base its questions on your real projects and technical experience.</p>
        <Link href="/dashboard/resume" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Interview Prep Hub</h2>
          <p className="text-slate-400 text-lg">Practice role-specific questions and take AI mock interviews.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:scale-[1.02]"
        >
          <Play className="w-5 h-5 fill-current" /> Start AI Mock Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 relative z-10">
            <Code className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">Target Role</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">{targetRole}</p>
          <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner relative z-10">
            <div className="absolute inset-0 bg-blue-500 rounded-full" style={{ width: '100%' }}>
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 blur-[2px] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.1)] transition-all group relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
          <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-colors border border-sky-500/20 relative z-10">
            <MessageSquare className="w-7 h-7 text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">Interview Score</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">Latest AI Score: {interviewScore}/100</p>
          <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner relative z-10">
            <div className="absolute inset-0 bg-sky-500 rounded-full" style={{ width: `${interviewScore}%` }}>
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 blur-[2px] rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl opacity-60 relative overflow-hidden group transition-opacity">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800 text-xs font-bold text-slate-400 rounded-lg border border-slate-700 tracking-wide uppercase">Coming Phase 3</div>
          <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 relative z-10">
            <Mic className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-300 mb-2 tracking-tight relative z-10">Voice Interviews</h3>
          <p className="text-slate-500 text-sm font-medium relative z-10">Real-time voice-based AI interviewer.</p>
        </motion.div>
      </div>

      <div className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
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

        <div className="p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-30 text-blue-400" />
              <p className="text-lg text-slate-500 mb-4">Click &quot;Start AI Mock Interview&quot; above to begin a live, resume-based interrogation.</p>
              <p className="text-sm text-slate-600">The AI will aggressively grill you on your real projects based on your uploaded resume.</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* AI Interview Simulator Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetRole={targetRole}
        resumeSummary={summary}
      />
    </div>
  );
}
