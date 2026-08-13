"use client";
import { useState } from 'react';
import { UploadCloud, CheckCircle2, X, Brain, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ResumeUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<{id: string, name: string, category: string}[] | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setExtractedSkills([
        { id: '1', name: 'JavaScript', category: 'Language' },
        { id: '2', name: 'React', category: 'Framework' },
        { id: '3', name: 'Node.js', category: 'Backend' },
        { id: '4', name: 'Python', category: 'Language' },
        { id: '5', name: 'SQL', category: 'Database' },
      ]);
    }, 2500);
  };

  const removeSkill = (id: string) => {
    if(extractedSkills) setExtractedSkills(extractedSkills.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Resume Parsing</h2>
        <p className="text-slate-400 text-lg">Upload your latest resume. Our AI will extract your current skills to find your gaps.</p>
      </div>

      {!extractedSkills ? (
        <div className="bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl relative overflow-hidden group">
          
          {/* Animated Glow Behind Dropzone */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none"></div>
          
          {/* Star 1 */}
          <motion.div animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 left-10 text-white pointer-events-none">
            <Sparkles className="w-8 h-8 opacity-60" />
          </motion.div>
          {/* Star 2 */}
          <motion.div animate={{ y: [0, 15, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-20 right-16 text-white pointer-events-none">
             <Sparkles className="w-6 h-6 opacity-60" />
          </motion.div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-[1.35rem] p-16 flex flex-col items-center justify-center transition-all duration-500 relative z-10 bg-white/5",
              file ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 hover:border-blue-500/30 hover:bg-white/10"
            )}
          >
            {isUploading ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 relative mb-8">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  <Brain className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Analyzing your experience...</h3>
                <p className="text-blue-200/60 text-base">Extracting core skills and project history.</p>
              </motion.div>
            ) : file ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{file.name}</h3>
                <p className="text-slate-400 text-sm mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Extraction</p>
                <div className="flex gap-4 w-full max-w-sm">
                  <button onClick={() => setFile(null)} className="flex-1 px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Cancel</button>
                  <button onClick={simulateUpload} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">Start AI Parser</button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Drag & Drop your resume</h3>
                <p className="text-slate-400 text-base mb-8 max-w-md">Supports PDF and DOCX up to 10MB. We'll automatically identify your core competencies.</p>
                <label className="bg-white text-[#030712] hover:bg-slate-200 px-8 py-3 rounded-xl font-bold transition-colors cursor-pointer shadow-xl">
                  Browse Files
                  <input type="file" className="hidden" accept=".pdf,.docx" onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }} />
                </label>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-md p-6 rounded-2xl flex items-start gap-4 shadow-lg shadow-green-500/5">
            <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-green-100 mb-1">Extraction Complete</h3>
              <p className="text-sm text-green-200/70">We've identified the following skills from your resume. Please review and remove any inaccurate extractions before generating your roadmap.</p>
            </div>
          </div>
          
          <div className="bg-[#030712]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors duration-700 pointer-events-none"></div>
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
              <Brain className="w-6 h-6 text-purple-400" /> Extracted Skills
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-10 relative z-10">
              {extractedSkills.map((skill, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: index * 0.05 }}
                  key={skill.id} 
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl group transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                  <button onClick={() => removeSkill(skill.id)} className="text-slate-500 hover:text-red-400 transition-colors focus:outline-none ml-1">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: extractedSkills.length * 0.05 }} className="flex items-center gap-1 border border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                + Add Missing Skill
              </motion.button>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10 relative z-10">
              <button onClick={() => router.push('/dashboard/skill-gap')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Confirm & View Skill Gap
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
