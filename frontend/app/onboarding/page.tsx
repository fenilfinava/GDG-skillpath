"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Clock, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { roles } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { SpotlightTiltCard } from '@/components/ui/SpotlightTiltCard';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    hours: '10',
    deadline: '3 months'
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push('/dashboard/resume');
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 animate-noise"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 transition-opacity duration-700"></div>
      </div>
      
      <SpotlightTiltCard 
        spotlightColor="rgba(59, 130, 246, 0.2)"
        className="w-full max-w-2xl p-8 relative z-10 shadow-2xl bg-[#030712]/60 backdrop-blur-xl border border-white/10 rounded-3xl"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Let's build your roadmap</h2>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {step} of 3</div>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full flex-1 transition-all duration-500 shadow-inner",
                  i <= step ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/5 border border-white/5"
                )}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">What is your target role?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(role => (
                  <SpotlightTiltCard
                    key={role.id}
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    spotlightColor="rgba(59, 130, 246, 0.15)"
                    className={cn(
                      "p-5 rounded-2xl border text-left transition-all duration-300 group cursor-pointer relative overflow-hidden",
                      formData.role === role.id 
                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59, 130, 246, 0.15)]" 
                        : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    <div className="font-bold text-slate-200 group-hover:text-white transition-colors relative z-10">{role.title}</div>
                    <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider relative z-10">{role.category}</div>
                  </SpotlightTiltCard>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">How much time can you commit?</h3>
              </div>
              
              <div className="space-y-6 bg-white/5 border border-white/5 p-8 rounded-2xl">
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider text-center">Hours per week</label>
                  <div className="relative flex items-center justify-center w-48">
                    <input 
                      type="number" 
                      min="1" max="100"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      className="w-full bg-[#030712] border-2 border-purple-500/30 rounded-2xl py-4 px-6 text-4xl font-black text-white text-center focus:outline-none focus:border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">hrs/week</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">What's your timeline?</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {['1 month', '3 months', '6 months', '1 year+'].map(time => (
                  <SpotlightTiltCard
                    key={time}
                    onClick={() => setFormData({ ...formData, deadline: time })}
                    spotlightColor="rgba(6, 182, 212, 0.15)"
                    className={cn(
                      "p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer relative overflow-hidden",
                      formData.deadline === time 
                        ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6, 182, 212, 0.15)]" 
                        : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    <div className="font-bold text-slate-200 relative z-10">{time}</div>
                  </SpotlightTiltCard>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10 relative z-10">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-0 transition-all cursor-pointer"
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            disabled={
              (step === 1 && !formData.role) || 
              (step === 3 && !formData.deadline)
            }
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:border disabled:border-white/10 disabled:text-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer"
          >
            {step === 3 ? (
              <>Finish & Upload Resume <CheckCircle2 className="w-5 h-5" /></>
            ) : (
              <>Continue <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </SpotlightTiltCard>
    </div>
  );
}
