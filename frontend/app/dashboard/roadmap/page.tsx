"use client";
import { useResume } from '@/lib/ResumeContext';
import { CheckCircle2, Circle, Clock, PlayCircle, BookOpen, Code, Video, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RoadmapView() {
  const { skills, targetRole, roadmapPhases, hasData, setRoadmapData, toggleTaskComplete } = useResume();
  const [selectedTask, setSelectedTask] = useState<{title: string, type: string, duration: string, rationale?: string, completed?: boolean, phaseId?: string, taskId?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    if (!hasData || skills.length === 0) return;
    // Don't re-fetch if we already have roadmap data
    if (roadmapPhases.length > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          skills: skills.map(s => s.name),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Roadmap generation failed.' }));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setRoadmapData(data.phases || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [hasData, skills, targetRole, roadmapPhases.length, setRoadmapData]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const getTaskIcon = (type: string) => {
    switch(type) {
      case 'course': return <Video className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'practice': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // Empty state: no resume uploaded yet
  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8">
          <FileText className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">No Roadmap Yet</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md">Upload your resume first so our AI can generate a personalized learning roadmap.</p>
        <Link href="/dashboard/resume" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          Upload Resume
        </Link>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 relative mb-8">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <Loader2 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Generating Your Roadmap...</h2>
        <p className="text-slate-400 text-base">Our AI is building a personalized learning path for <span className="text-blue-400 font-semibold">{targetRole}</span>.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-lg">
          <h2 className="text-xl font-bold text-red-300 mb-3">Roadmap Generation Failed</h2>
          <p className="text-red-200/70 text-sm mb-6">{error}</p>
          <button onClick={() => { setError(null); fetchRoadmap(); }} className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-2.5 rounded-xl font-bold transition-all border border-red-500/30">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end shrink-0 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">My Learning Roadmap</h2>
          <p className="text-slate-400 text-base md:text-lg">Your personalized path to becoming a <span className="text-blue-400 font-semibold">{targetRole}</span>.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-8 pt-1 custom-scrollbar -mx-4 px-4">
        <div className="flex gap-6 h-full min-w-max pr-16 pl-2">
          {roadmapPhases.map((phase, phaseIndex) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIndex * 0.12 }}
              key={phase.id} 
              className="w-[340px] shrink-0 flex flex-col h-[calc(100vh-260px)] min-h-[520px]"
            >
              <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full shadow-lg shrink-0",
                  phase.status === 'completed' ? "bg-green-500 shadow-green-500/50" :
                  phase.status === 'in-progress' ? "bg-blue-500 animate-pulse shadow-blue-500/50" :
                  "bg-slate-700"
                )} />
                <h3 className="font-bold text-xl text-white tracking-tight truncate">{phase.title}</h3>
              </div>

              <div className={cn(
                "flex-1 bg-[#030712]/50 backdrop-blur-md rounded-[2rem] border shadow-2xl relative overflow-hidden",
                phase.status === 'in-progress' ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.08)]" : "border-white/10"
              )}>
                <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
                <div className="absolute inset-0 overflow-y-auto p-5 pb-12 space-y-4 custom-scrollbar">
                {phase.tasks.map((task, taskIndex) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (phaseIndex * 0.1) + (taskIndex * 0.08) }}
                    key={task.id}
                    onClick={() => setSelectedTask({ ...task, phaseId: phase.id, taskId: task.id })}
                    className={cn(
                      "p-5 rounded-2xl border transition-all duration-300 cursor-pointer group",
                      task.completed ? "bg-white/5 border-white/5 opacity-60" :
                      phase.status === 'locked' ? "bg-[#030712]/50 border-white/5 opacity-40 cursor-not-allowed" :
                      "bg-white/10 border-white/10 hover:border-blue-500/50 hover:bg-white/15 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1.5 bg-black/40 text-slate-300 rounded-md flex items-center gap-1.5 uppercase tracking-wider">
                        {getTaskIcon(task.type)} <span>{task.type}</span>
                      </span>
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                      ) : phase.status !== 'locked' ? (
                        <Circle className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
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
                  </motion.div>
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
              className="bg-[#0f172a] border border-white/10 shadow-2xl w-full max-w-xl p-8 rounded-[2rem]" 
              onClick={e => e.stopPropagation()}
            >
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
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
                {!selectedTask.completed && selectedTask.phaseId && selectedTask.taskId && (
                  <button 
                    onClick={() => {
                      toggleTaskComplete(selectedTask.phaseId!, selectedTask.taskId!);
                      setSelectedTask(null);
                    }}
                    className="flex-[2] bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Mark Complete
                  </button>
                )}
                {selectedTask.completed && selectedTask.phaseId && selectedTask.taskId && (
                  <button 
                    onClick={() => {
                      toggleTaskComplete(selectedTask.phaseId!, selectedTask.taskId!);
                      setSelectedTask(null);
                    }}
                    className="flex-[2] bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <Circle className="w-5 h-5" /> Mark Incomplete
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
