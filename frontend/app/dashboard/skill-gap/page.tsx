"use client";
import { skillGaps, mockUser } from '@/lib/mock-data';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { Target, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SkillGapDashboard() {
  const chartData = skillGaps.map(gap => ({
    subject: gap.name,
    Current: gap.currentLevel,
    Target: gap.targetLevel,
    fullMark: 100,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Skill Gap Analysis</h2>
          <p className="text-slate-400 text-lg">Comparing your current skills against the <span className="text-blue-400 font-semibold">{mockUser.targetRole}</span> requirements.</p>
        </div>
        <Link href="/dashboard/roadmap" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
          Generate Roadmap <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col min-h-[450px] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <Target className="w-6 h-6 text-blue-400" /> Skill Proficiency Radar
          </h3>
          <div className="flex-1 w-full relative -ml-4 z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#ffffff" strokeOpacity={0.1} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} axisLine={false} />
                <Radar name="Target Level" dataKey="Target" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.2} />
                <Radar name="Current Level" dataKey="Current" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.5} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <AlertTriangle className="w-6 h-6 text-orange-400" /> Prioritized Gaps
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10 custom-scrollbar">
            {skillGaps.map((gap, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                key={gap.id} 
                className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white text-base mb-1">{gap.name}</h4>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{gap.category}</span>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${
                    gap.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                    gap.priority === 'Important' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                    'bg-white/10 text-slate-300 border border-white/20'
                  }`}>
                    {gap.priority}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2.5">
                  <span>Current: {gap.currentLevel}%</span>
                  <span>Target: {gap.targetLevel}%</span>
                </div>
                {/* Premium Animated Progress Bar */}
                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner">
                  {/* Target Line */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10" style={{ left: `${gap.targetLevel}%` }}></div>
                  
                  {/* Animated Fill Track */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${gap.currentLevel}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                    className={`h-full rounded-full relative ${
                      gap.priority === 'Critical' ? 'bg-gradient-to-r from-red-600 to-red-400' :
                      gap.priority === 'Important' ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                      'bg-gradient-to-r from-blue-600 to-blue-400'
                    }`}
                  >
                    {/* Glowing Leading Edge */}
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-[2px] rounded-full"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
