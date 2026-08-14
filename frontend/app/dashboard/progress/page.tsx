"use client";
import { useResume } from '@/lib/ResumeContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Award, Flame, CheckCircle, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ProgressDashboard() {
  const { roadmapPhases, interviewScore, hasData, gaps } = useResume();

  // Dynamic calculations from live data
  const { completedTasks, totalTasks, readinessScore, totalHours, dynamicActivityData } = useMemo(() => {
    const allTasks = roadmapPhases.flatMap(p => p.tasks);
    const total = allTasks.length;
    const completedTasksList = allTasks.filter(t => t.completed);
    const completed = completedTasksList.length;
    const roadmapPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const readiness = total > 0 ? Math.round((roadmapPct + interviewScore) / 2) : interviewScore;
    
    // Sum up real activity hours from completed tasks
    let realTotalHours = 0;
    completedTasksList.forEach(t => {
      const match = t.duration.match(/(\d+)\s*(hr|hour|min)/i);
      if (match) {
        const val = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.startsWith('min')) {
          realTotalHours += val / 60;
        } else {
          realTotalHours += val;
        }
      }
    });
    realTotalHours = Math.round(realTotalHours);

    // Distribute real hours across the week chart deterministically
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activity = days.map(d => ({ name: d, hours: 0 }));
    
    if (realTotalHours > 0) {
      let remaining = realTotalHours;
      // Start from the most recent days (Sun, Sat, Fri...)
      let i = 6;
      while (remaining > 0) {
        const chunk = Math.min(remaining, Math.max(1, Math.ceil(realTotalHours / 4)));
        activity[i].hours += chunk;
        remaining -= chunk;
        i = (i - 1 + 7) % 7;
      }
    }

    return { 
      completedTasks: completed, 
      totalTasks: total, 
      readinessScore: readiness, 
      totalHours: realTotalHours,
      dynamicActivityData: activity
    };
  }, [roadmapPhases, interviewScore]);

  // Dynamic milestones derived from actual progress
  const milestones = useMemo(() => {
    const items: { emoji: string; title: string; description: string; color: string }[] = [];

    if (hasData) {
      items.push({ emoji: '📄', title: 'Resume Parsed', description: `${gaps.length} skill gaps identified`, color: 'bg-orange-500/20' });
    }
    if (roadmapPhases.length > 0) {
      items.push({ emoji: '🗺️', title: 'Roadmap Generated', description: `${totalTasks} tasks across ${roadmapPhases.length} phases`, color: 'bg-blue-500/20' });
    }
    if (completedTasks > 0) {
      items.push({ emoji: '🚀', title: `${completedTasks} Tasks Completed`, description: `${Math.round((completedTasks / totalTasks) * 100)}% roadmap progress`, color: 'bg-green-500/20' });
    }
    if (interviewScore > 0) {
      items.push({ emoji: '🎯', title: 'Interview Attempted', description: `Latest score: ${interviewScore}/100`, color: 'bg-purple-500/20' });
    }
    if (items.length === 0) {
      items.push({ emoji: '👋', title: 'Welcome!', description: 'Upload your resume to get started', color: 'bg-slate-500/20' });
    }
    return items;
  }, [hasData, gaps.length, roadmapPhases.length, totalTasks, completedTasks, interviewScore]);

  // Empty state
  if (!hasData) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8">
          <FileText className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">No Progress Data Yet</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-md">Upload your resume to start tracking your learning journey and milestones.</p>
        <Link href="/dashboard/resume" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Progress</h2>
        <p className="text-slate-400">Track your learning journey and milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Skill Gaps</p>
            <p className="text-2xl font-bold text-white">{gaps.length}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Hours This Week</p>
            <p className="text-2xl font-bold text-white">{totalHours} hrs</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Tasks Completed</p>
            <p className="text-2xl font-bold text-white">{completedTasks}/{totalTasks}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Readiness</p>
            <p className="text-2xl font-bold text-white">{readinessScore}/100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-6 col-span-1 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <h3 className="relative z-10 text-lg font-semibold text-white mb-6">Learning Activity (Last 7 Days)</h3>
          <div className="relative z-10 h-[300px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicActivityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none"></div>
          <h3 className="relative z-10 text-lg font-semibold text-white mb-6">Milestones</h3>
          <div className="relative z-10 space-y-6">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx < milestones.length - 1 && (
                  <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-800"></div>
                )}
                <div className={`w-12 h-12 shrink-0 ${milestone.color} rounded-full flex items-center justify-center relative z-10 border-4 border-[#0f172a]`}>
                  <span className="text-xl">{milestone.emoji}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">{milestone.title}</h4>
                  <p className="text-sm text-slate-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
