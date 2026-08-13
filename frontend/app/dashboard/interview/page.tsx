"use client";
import { interviewQuestions } from '@/lib/mock-data';
import { useState } from 'react';
import { Mic, MessageSquare, Code, Play, ShieldAlert, X, Volume2, MicOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightTiltCard } from '@/components/ui/SpotlightTiltCard';
import { GlowingProgressBar } from '@/components/ui/GlowingProgressBar';

export default function InterviewPrepHub() {
  const [activeTab, setActiveTab] = useState('Technical');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aiState, setAiState] = useState<'listening' | 'speaking' | 'thinking'>('speaking');

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
        <button 
          onClick={() => setIsVoiceModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transform hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-5 h-5" /> Start AI Voice Interview
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
        <SpotlightTiltCard 
          spotlightColor="rgba(59, 130, 246, 0.15)"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-between"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
          <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          
          <div>
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20 relative z-10">
              <Code className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">DSA Tracker</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">You've solved 45/150 recommended problems.</p>
          </div>
          
          <GlowingProgressBar value={30} glowColor="rgba(59, 130, 246, 0.3)" />
        </SpotlightTiltCard>

        <SpotlightTiltCard 
          spotlightColor="rgba(14, 165, 233, 0.15)"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }} 
          className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-between"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
          <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          
          <div>
            <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-colors border border-sky-500/20 relative z-10">
              <MessageSquare className="w-7 h-7 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">Text Interviews</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium relative z-10">Avg. Score: 78/100 across 3 sessions.</p>
          </div>
          
          <GlowingProgressBar value={78} glowColor="rgba(14, 165, 233, 0.3)" barClassName="bg-gradient-to-r from-sky-500 to-cyan-400" />
        </SpotlightTiltCard>

        <SpotlightTiltCard 
          spotlightColor="rgba(168, 85, 247, 0.2)"
          onClick={() => setIsVoiceModalOpen(true)}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="bg-[#030712]/50 border border-purple-500/30 p-8 rounded-3xl flex flex-col justify-between cursor-pointer hover:border-purple-500/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] group"
        >
          <div className="absolute inset-0 bg-grid pointer-events-none opacity-20"></div>
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-purple-500/20 text-xs font-bold text-purple-300 rounded-lg border border-purple-500/30 tracking-wide uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span> Live AI Voice
          </div>
          
          <div>
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 relative z-10 group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight relative z-10">Voice Interviews</h3>
            <p className="text-slate-400 text-sm font-medium relative z-10">Real-time voice conversation with AI mock interviewer.</p>
          </div>
          <GlowingProgressBar value={100} glowColor="rgba(168, 85, 247, 0.4)" barClassName="bg-gradient-to-r from-purple-500 to-pink-500" />
        </SpotlightTiltCard>
      </div>

      <div className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative text-left">
        <div className="flex border-b border-white/5 bg-white/[0.02] relative z-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-8 py-5 text-sm font-bold transition-colors border-b-2 tracking-wide cursor-pointer",
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
                      <button className="text-sm font-bold text-slate-400 hover:text-white px-5 py-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer">View Answer</button>
                      <button 
                        onClick={() => setIsVoiceModalOpen(true)}
                        className="text-sm font-bold bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl transition-all shadow-md group-hover:shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Mic className="w-4 h-4" /> Practice Voice
                      </button>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Voice Mode Fullscreen Overlay */}
      <AnimatePresence>
        {isVoiceModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-center"
          >
            <div className="relative w-full max-w-2xl flex flex-col items-center">
              <button 
                onClick={() => setIsVoiceModalOpen(false)}
                className="absolute -top-16 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <span className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mx-auto w-fit">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span> Live Voice Session
                </span>
                <h3 className="text-3xl font-black text-white mt-4 tracking-tight">AI Technical Interviewer</h3>
                <p className="text-slate-400 text-sm mt-2">"Tell me about a challenging technical problem you solved using React."</p>
              </div>

              {/* Pulsing Siri-Style Voice Orb Visualizer */}
              <div className="relative w-64 h-64 flex items-center justify-center my-8">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.25, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-50"
                />
                <motion.div 
                  animate={{ 
                    scale: [1.1, 0.9, 1.1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-indigo-500 blur-xl opacity-70"
                />
                <div className="relative w-40 h-40 rounded-full bg-[#030712] border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ height: ["20%", "70%", "30%", "80%", "40%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-1.5"
                  >
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full h-12 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 mt-6">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button 
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] cursor-pointer"
                >
                  End Interview
                </button>

                <button 
                  onClick={() => setAiState(aiState === 'listening' ? 'speaking' : 'listening')}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 text-purple-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
