"use client";
import { mockUser, roles } from '@/lib/mock-data';
import { User, Bell, Shield, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    targetRole: 'sde',
    hoursPerWeek: mockUser.hoursPerWeek,
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Settings</h2>
        <p className="text-slate-400 text-lg">Manage your profile and learning preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Settings Navigation */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-blue-500/10 text-blue-400 rounded-2xl font-bold border border-blue-500/20 text-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <User className="w-5 h-5" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl font-bold text-sm transition-colors border border-transparent">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl font-bold text-sm transition-colors border border-transparent">
            <Shield className="w-5 h-5" /> Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight relative z-10">Profile Information</h3>
            
            <div className="flex items-center gap-6 mb-10 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg shadow-purple-500/20 border-2 border-white/10">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-white/10 shadow-sm">
                Change Avatar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tight relative z-10">Learning Preferences</h3>
            
            <div className="space-y-8 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Target Role</label>
                <div className="relative">
                  <select 
                    value={formData.targetRole}
                    onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all appearance-none font-medium cursor-pointer"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id} className="bg-slate-900">{role.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-orange-400/80 mt-3 flex items-center gap-1.5"><Shield className="w-4 h-4"/> Warning: Changing your target role will completely regenerate your roadmap.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Weekly Commitment (Hours)</label>
                <input 
                  type="number" 
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({...formData, hoursPerWeek: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium"
                />
                <p className="text-sm text-slate-500 mt-3 font-medium">We'll adapt your roadmap schedule based on this.</p>
              </div>
            </div>

            <div className="mt-10 flex justify-end relative z-10">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                Save Preferences
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#030712]/50 backdrop-blur-xl border border-red-500/20 rounded-3xl p-10 shadow-2xl group hover:border-red-500/40 transition-colors relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h3 className="text-2xl font-bold text-red-400 mb-3 tracking-tight flex items-center gap-2 relative z-10"><Shield className="w-6 h-6"/> Danger Zone</h3>
            <p className="text-base text-slate-400 mb-8 font-medium relative z-10">Irreversible actions for your account.</p>
            
            <button className="flex items-center gap-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] relative z-10">
              <LogOut className="w-5 h-5" /> Delete Account & Data
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
