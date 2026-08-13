"use client";
import { mockUser } from '@/lib/mock-data';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Award, Flame, CheckCircle, Clock } from 'lucide-react';

const activityData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 3 },
];

export default function ProgressDashboard() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Progress</h2>
        <p className="text-slate-400">Track your learning journey and milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Current Streak</p>
            <p className="text-2xl font-bold text-white">{mockUser.streak} Days</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Hours This Week</p>
            <p className="text-2xl font-bold text-white">21 hrs</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Tasks Completed</p>
            <p className="text-2xl font-bold text-white">14</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Readiness</p>
            <p className="text-2xl font-bold text-white">{mockUser.readinessScore}/100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-6 col-span-1 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <h3 className="relative z-10 text-lg font-semibold text-white mb-6">Learning Activity (Last 7 Days)</h3>
          <div className="relative z-10 h-[300px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
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
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <h3 className="relative z-10 text-lg font-semibold text-white mb-6">Recent Milestones</h3>
          <div className="relative z-10 space-y-6">
            
            <div className="flex gap-4 relative">
              <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-800"></div>
              <div className="w-12 h-12 shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center relative z-10 border-4 border-[#0f172a]">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Started React Journey</h4>
                <p className="text-sm text-slate-400">Completed Foundation Phase</p>
                <span className="text-xs text-slate-500 mt-1 block">2 days ago</span>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-slate-800"></div>
              <div className="w-12 h-12 shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center relative z-10 border-4 border-[#0f172a]">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">10 Day Streak</h4>
                <p className="text-sm text-slate-400">Consistent learning pays off!</p>
                <span className="text-xs text-slate-500 mt-1 block">5 days ago</span>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-12 h-12 shrink-0 bg-orange-500/20 rounded-full flex items-center justify-center relative z-10 border-4 border-[#0f172a]">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">Resume Parsed</h4>
                <p className="text-sm text-slate-400">Account created & gaps identified</p>
                <span className="text-xs text-slate-500 mt-1 block">2 weeks ago</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
