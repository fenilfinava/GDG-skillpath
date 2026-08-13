"use client";
import { roadmapPhases } from '@/lib/mock-data';
import { CheckCircle2, Circle, Clock, PlayCircle, BookOpen, Code, Video, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlitchText } from '@/components/ui/GlitchText';
import { SpotlightTiltCard } from '@/components/ui/SpotlightTiltCard';
import { Confetti } from '@/components/ui/Confetti';

export default function RoadmapView() {
  const [selectedTask, setSelectedTask] = useState<{id?: string, title: string, type: string, duration: string, rationale?: string, completed?: boolean} | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelUpNotification, setLevelUpNotification] = useState<string | null>(null);

  const getTaskIcon = (type: string) => {
    switch(type) {
      case 'course': return <Video className="w-4 h-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 text-blue-400" />;
      case 'project': return <Code className="w-4 h-4 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 text-purple-400" />;
      case 'practice': return <BookOpen className="w-4 h-4 transition-transform duration-500 group-hover:scale-125 group-hover:translate-y-[-2px] text-cyan-400" />;
      default: return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCompleteTask = () => {
    if (!selectedTask) return;
    setShowConfetti(true);
    setLevelUpNotification(`LEVEL UP! Completed: "${selectedTask.title}" (+50 XP)`);
    setSelectedTask(null);

    setTimeout(() => {
      setLevelUpNotification(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col min-w-0 w-full relative">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Level Up Toast Notification */}
      <AnimatePresence>
        {levelUpNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px] rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            <div className="bg-[#030712] px-6 py-4 rounded-[14px] flex items-center gap-3 text-white">
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30">
                <Trophy className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Level Up!
                </div>
                <div className="text-sm font-bold text-slate-200">{levelUpNotification}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            My Learning Roadmap
          </h2>
          <p className="text-slate-400 text-lg">Your personalized path to becoming interview-ready.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-8 h-full min-w-max px-2">
          {roadmapPhases.map((phase, phaseIndex) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIndex * 0.15 }}
              key={phase.id} 
              className="w-[340px] flex flex-col h-full max-h-[75vh]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full shadow-lg",
                  phase.status === 'completed' ? "bg-green-500 shadow-green-500/50" :
                  phase.status === 'in-progress' ? "bg-blue-500 animate-pulse shadow-blue-500/50" :
                  "bg-slate-700"
                )} />
                <h3 className="font-bold text-xl text-white tracking-tight">{phase.title}</h3>
              </div>

              <div className={cn(
                "flex-1 bg-[#030712]/40 backdrop-blur-md rounded-[2rem] p-5 border overflow-hidden space-y-4 shadow-xl relative",
                phase.status === 'in-progress' ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.05)]" : "border-white/5"
              )}>
                <div className="absolute inset-0 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {phase.tasks.map((task, taskIndex) => (
                  <SpotlightTiltCard 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (phaseIndex * 0.15) + (taskIndex * 0.1) }}
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    spotlightColor="rgba(59, 130, 246, 0.2)"
                    className={cn(
                      "group p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                      task.completed ? "bg-white/5 border-white/5 opacity-60" :
                      phase.status === 'locked' ? "bg-[#030712]/50 border-white/5 opacity-40 cursor-not-allowed" :
                      "bg-white/10 border-white/10 hover:border-blue-500/50 hover:bg-white/15 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)]"
                    )}
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold px-2.5 py-1.5 bg-black/40 text-slate-300 rounded-md flex items-center gap-1.5 uppercase tracking-wider">
                          {getTaskIcon(task.type)} <span>{task.type}</span>
                        </span>
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : phase.status !== 'locked' ? (
                          <Circle className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        ) : null}
                      </div>
                      <h4 className={cn("font-bold text-lg mb-3 leading-tight", task.completed ? "text-slate-400 line-through" : "text-white")}>
                        {task.title}
                      </h4>
                      
                      {task.recommended && (
                        <div className="mb-4 text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-500/30 flex items-center gap-1">
                          ✨ Highly Recommended
                        </div>
                      )}

                      <div className="flex items-center text-sm font-semibold text-slate-400 gap-1.5">
                        <Clock className="w-4 h-4" />
                        {task.duration}
                      </div>
                    </div>
                  </SpotlightTiltCard>
                ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md" 
            onClick={() => setSelectedTask(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0f172a] border border-white/10 shadow-2xl w-full max-w-xl p-8 rounded-[2rem] relative overflow-hidden group" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors duration-700 pointer-events-none"></div>
              <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-1.5 uppercase tracking-wider">
                    {getTaskIcon(selectedTask.type)} <span>{selectedTask.type}</span>
                  </span>
                  <span className="text-sm font-bold text-slate-400 flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"><Clock className="w-4 h-4"/> {selectedTask.duration}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight leading-tight">{selectedTask.title}</h3>
                
                {selectedTask.rationale && (
                  <div className="bg-purple-500/10 border border-purple-500/30 p-5 rounded-2xl mb-8">
                    <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">✨ AI Rationale</h4>
                    <p className="text-base text-purple-100/70 leading-relaxed">{selectedTask.rationale}</p>
                  </div>
                )}
                
                <p className="text-slate-300 text-base mb-10 leading-relaxed">
                  This task will help you build core competencies required for your target role. 
                  Click below to start learning or mark it as complete if you already know this topic.
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  {!selectedTask.completed && (
                    <button 
                      onClick={handleCompleteTask}
                      className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
