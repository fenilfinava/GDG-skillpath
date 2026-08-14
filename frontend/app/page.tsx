"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, Variants } from 'framer-motion';
import { ArrowRight, Target, Shield, FileText, Clock, Sparkles, BrainCircuit, ChevronRight, Zap, TrendingUp, Users, BarChart3, Code2, BookOpen, Cpu, Database, Globe, Layers, Terminal, Star } from 'lucide-react';
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Steps from "@/components/Steps";

/* ────────────────────────────────────────────
   TILT CARD (3D Mouse Tracking)
   ──────────────────────────────────────────── */
import { SpotlightTiltCard } from '@/components/ui/SpotlightTiltCard';

/* ────────────────────────────────────────────
   TILT CARD (3D Mouse Tracking) - Wraps SpotlightTiltCard
   ──────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <SpotlightTiltCard spotlightColor="rgba(59, 130, 246, 0.15)" className={className}>
      {children}
    </SpotlightTiltCard>
  );
}

/* ────────────────────────────────────────────
   ANIMATED COUNTER
   ──────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "", label, icon: Icon }: { target: number, suffix?: string, label: string, icon?: any }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center group w-full px-4 text-center">
      {Icon && (
        <div className="w-12 h-12 mb-6 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-cyan-300 transition-all duration-300 shadow-xl">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-500 mt-2 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

/* ────────────────────────────────────────────
   INFINITE MARQUEE
   ──────────────────────────────────────────── */
function InfiniteMarquee() {
  const skills = [
    { icon: Code2, label: "React" },
    { icon: Database, label: "PostgreSQL" },
    { icon: Globe, label: "Next.js" },
    { icon: Cpu, label: "Python" },
    { icon: Layers, label: "System Design" },
    { icon: Terminal, label: "Node.js" },
    { icon: BookOpen, label: "DSA" },
    { icon: BarChart3, label: "ML/AI" },
  ];

  return (
    <div className="overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 w-max"
      >
        {[...skills, ...skills].map((skill, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors">
            <skill.icon className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">{skill.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN LANDING PAGE
   ──────────────────────────────────────────── */
export default function LandingPage() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  
  const APP_URL = '/onboarding';

  const codeString = `import claude_ai from anthropic
import json

# Load and parse user resume
resume_data = extract_text("resume.pdf")

async def generate_career_path(resume, target_role="SDE"):
    # AI analyzes skill gaps
    gaps = await claude_ai.analyze_gaps(resume, target_role)
    
    # Generate weekly learning roadmap
    roadmap = claude_ai.create_roadmap(gaps)
    
    return json.dumps(roadmap, indent=2)

if __name__ == "__main__":
    print("Generating personalized roadmap...")`;

  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
          if (charIndex < codeString.length) {
              setDisplayedCode((prev) => prev + codeString.charAt(charIndex));
              charIndex++;
          } else {
              clearInterval(typeInterval);
          }
      }, 30);

      return () => clearInterval(typeInterval);
  }, [codeString]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  const steps = [
    { num: "01", title: "Upload Resume", desc: "Our AI parses your PDF in seconds and extracts every skill.", icon: FileText, color: "purple" as const },
    { num: "02", title: "Set Target Role", desc: "Pick your dream job — SDE, Data Scientist, DevOps, or more.", icon: Target, color: "blue" as const },
    { num: "03", title: "Get Your Roadmap", desc: "Receive a step-by-step plan personalized to your gaps and timeline.", icon: TrendingUp, color: "cyan" as const },
    { num: "04", title: "Practice & Track", desc: "Follow your roadmap, solve problems, and ace mock interviews.", icon: Zap, color: "orange" as const },
  ];

  const colorMap = {
    purple: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-300", glow: "bg-purple-500/20" },
    blue: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-300", glow: "bg-blue-500/20" },
    cyan: { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-300", glow: "bg-cyan-500/20" },
    orange: { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-300", glow: "bg-orange-500/20" },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] overflow-hidden font-sans text-slate-100 selection:bg-blue-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 animate-noise"></div>
        <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <motion.div animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-[#030712]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, type: "spring" }} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-300">
              <BrainCircuit className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SkillPath</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, type: "spring" }} className="flex gap-6 items-center">
            <Link href="/login" className="text-slate-400 hover:text-white font-medium transition-colors text-sm">Log in</Link>
            <Link href="/signup" className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#3b82f6,#8b5cf6,#06b6d4,#3b82f6)] opacity-70 group-hover:opacity-100 animate-[spin_3s_linear_infinite]" />
              <div className="relative bg-[#030712] px-6 py-2.5 rounded-full flex items-center gap-2 group-hover:bg-white/10 transition-all duration-300">
                <span className="font-semibold text-white text-sm">Get Started</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 w-full pt-10 pb-20">
        
        {/* ═══════════ EXACT COPIED HERO (Container Scroll) ═══════════ */}
        <div className="mb-20">
          <ContainerScroll
            titleComponent={
              <div className="flex flex-col items-center justify-center relative z-10 mb-20">
                {/* Floating Original White Stars */}
                <motion.div initial={{ opacity: 0, y: -20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute -top-20 right-[15%] hidden lg:block opacity-60">
                    <svg className="animate-pulse" fill="none" height="40" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="40">
                        <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
                    </svg>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="absolute bottom-10 right-[10%] hidden md:block opacity-30">
                    <svg className="animate-pulse" fill="none" height="24" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="24" style={{ animationDelay: '1s' }}>
                        <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
                    </svg>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="absolute top-1/2 -left-[5%] hidden lg:block opacity-40">
                    <svg className="animate-pulse" fill="none" height="32" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="32" style={{ animationDelay: '2s' }}>
                        <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
                    </svg>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl relative font-display">
                    Stop Guessing. <br />
                    <span className="relative inline-block mt-2">
                        <span>Start </span>
                        <span className="relative inline-block">
                            <span className="text-sky-400">Achieving.</span>
                            <svg className="absolute -bottom-3 left-0 w-full h-4 text-accent-purple opacity-90" fill="none" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path className="scribble-path" d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                        </span>
                    </span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                    AI-driven learning roadmaps generated instantly from your
                    <span className="relative inline-block text-slate-300 mx-1">
                        resume
                        <svg className="absolute -bottom-1 left-0 w-full h-3 text-white opacity-60" fill="none" preserveAspectRatio="none" viewBox="0 0 100 10">
                            <path d="M5 2 Q 50 8 95 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                        </svg>
                    </span>.
                    Identify your skill gaps and land your dream tech job without the guesswork.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="mt-10 flex flex-wrap justify-center gap-6 relative items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -left-16 top-2 hidden md:block rotate-[-20deg]">
                        <span className="font-hand text-white text-lg block mb-1">It&apos;s free!</span>
                        <svg fill="none" height="30" stroke="white" strokeWidth="1.5" viewBox="0 0 60 30" width="60">
                            <path d="M10 5 C 20 20, 40 20, 50 15 M 50 15 L 40 10 M 50 15 L 42 22" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </motion.div>

                    <Link href={APP_URL} className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all animate-pulse-glow hover:scale-105 cursor-pointer">
                        Generate Roadmap
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer">
                        <span className="material-symbols-outlined text-sm">dashboard</span>
                        Go to Dashboard
                    </Link>
                </motion.div>
            </div>
            }
          >
            {/* EXACT COPIED UI CONTENT inside Scroll Card */}
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="w-full h-full bg-[#0d1117] relative"
            >
                {/* Window Controls */}
                <div className="flex items-center justify-between border-b border-white/5 bg-[#010409] px-4 py-3 h-[50px]">
                    <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center rounded-md bg-[#0d1117] py-1 text-xs text-slate-400 font-mono border border-white/5">
                        <span className="material-symbols-outlined mr-2 text-[14px]">lock</span>
                        codeforgehub.dev/project/my-app
                    </div>
                    <div className="w-16"></div>
                </div>

                {/* Code Content Layout */}
                <div className="grid grid-cols-[250px_1fr] h-[calc(100%-50px)] text-left">
                    {/* Sidebar */}
                    <div className="border-r border-white/5 bg-[#0d1117] p-4 hidden sm:block h-full">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Explorer</div>
                        <div className="flex flex-col gap-2 font-mono text-sm text-slate-400">
                            <div className="flex items-center gap-2 hover:text-white cursor-pointer"><span className="material-symbols-outlined text-[16px]">folder</span> data</div>
                            <div className="flex items-center gap-2 pl-4 hover:text-white cursor-pointer"><span className="material-symbols-outlined text-[16px] text-red-400">picture_as_pdf</span> resume.pdf</div>
                            <div className="flex items-center gap-2 hover:text-white cursor-pointer"><span className="material-symbols-outlined text-[16px]">folder</span> core</div>
                            <div className="flex items-center gap-2 pl-4 hover:text-white cursor-pointer text-white bg-blue-500/10 rounded px-1 -ml-1"><span className="material-symbols-outlined text-[16px] text-yellow-400">javascript</span> analyzer.py</div>
                            <div className="flex items-center gap-2 pl-4 hover:text-white cursor-pointer"><span className="material-symbols-outlined text-[16px] text-green-400">data_object</span> roadmap.json</div>
                        </div>
                    </div>

                    {/* Editor + Terminal */}
                    <div className="bg-[#0d1117] p-6 font-mono text-sm overflow-hidden relative h-full flex flex-col">
                        <div className="flex gap-4 text-slate-600 border-b border-white/5 pb-2 mb-4 text-xs select-none">
                            <span className="text-white border-b border-blue-500 pb-2 -mb-2.5">analyzer.py</span>
                            <span>roadmap.json</span>
                            <span>resume.pdf</span>
                        </div>
                        <pre className="font-mono text-sm leading-6 flex-1 text-white">
                            <code dangerouslySetInnerHTML={{
                                __html: displayedCode.replace(/import|from|def|async|return|if|else|print/g, '<span class="text-[#ff7b72]">$&</span>')
                                    .replace(/"[^"]*"/g, '<span class="text-[#a5d6ff]">$&</span>')
                                    .replace(/#.*/g, '<span class="text-[#8b949e] italic">$&</span>')
                                    .replace(/\(/g, '<span class="text-yellow-300">(</span>')
                                    .replace(/\)/g, '<span class="text-yellow-300">)</span>')
                            }} />
                            <span ref={cursorRef} className="cursor-blink inline-block w-2.5 h-5 bg-indigo-500 align-middle ml-1"></span>
                        </pre>

                        {/* Terminal at bottom (absolute within editor pane) */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#010409] border-t border-white/10 p-3 font-mono text-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-2">
                                <span>TERMINAL</span>
                                <div className="flex gap-2">
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                </div>
                            </div>
                            <div className="text-green-400">user@skillpath:~/engine$ <span className="text-white">python analyzer.py --file resume.pdf</span></div>
                            <div className="text-slate-300">Extracting skills from resume.pdf... [DONE]</div>
                            <div className="text-slate-300">Target role: Software Development Engineer</div>
                            <div className="text-slate-300">Analyzing gaps with Claude AI...</div>
                            <div className="text-green-400">user@skillpath:~/engine$ <span className="w-2 h-4 bg-slate-400 inline-block align-middle animate-pulse"></span></div>
                        </div>
                    </div>
                </div>
            </motion.div>
          </ContainerScroll>
        </div>

        {/* ═══════════ SKILL MARQUEE ═══════════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mb-28 max-w-7xl mx-auto">
          <InfiniteMarquee />
        </motion.div>

        {/* ═══════════ BENTO GRID ═══════════ */}
        <div className="mb-32 max-w-7xl mx-auto px-6 relative">
          
          {/* Floating Stars for Bento Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute -top-10 left-[10%] hidden md:block opacity-40">
              <svg className="animate-pulse" fill="none" height="32" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="32" style={{ animationDelay: '0.5s' }}>
                  <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
              </svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute top-10 right-[5%] hidden lg:block opacity-30">
              <svg className="animate-pulse" fill="none" height="48" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="48" style={{ animationDelay: '1.5s' }}>
                  <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
              </svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="absolute top-32 left-[-2%] hidden lg:block opacity-20">
              <svg className="animate-pulse" fill="none" height="24" stroke="white" strokeLinecap="round" strokeWidth="1.5" viewBox="0 0 50 50" width="24" style={{ animationDelay: '2.5s' }}>
                  <path d="M25 5 L28 18 L42 20 L30 28 L34 42 L25 32 L16 42 L20 28 L8 20 L22 18 Z"></path>
              </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring" }} className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight relative inline-block">
                Everything you need. <br className="hidden md:block"/> In one place.
            </h2>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px] max-w-5xl mx-auto">
            
            <motion.div variants={itemVariants}>
              <TiltCard className="h-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl">
                {/* Ambient Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors duration-700 pointer-events-none"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-grid pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-auto group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300 relative z-10 shadow-lg">
                  <FileText className="w-6 h-6 text-slate-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <div className="relative z-10 mt-12">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-100 transition-colors">AI Resume Parsing</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">We extract your real skills in seconds, perfectly mapped to industry standards.</p>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <TiltCard className="h-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row relative overflow-hidden group transition-all duration-500 shadow-2xl">
                {/* Ambient Glow */}
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] group-hover:bg-blue-500/30 transition-colors duration-700 pointer-events-none"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-grid pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="md:w-3/5 flex flex-col justify-end relative z-10 pr-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300 shadow-lg">
                    <Target className="w-6 h-6 text-slate-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-100 transition-colors">Know your gaps.</h3>
                  <p className="text-slate-400 text-base leading-relaxed">See exactly how your current skills map to the requirements of your dream job.</p>
                </div>

                <div className="md:w-2/5 mt-8 md:mt-0 relative flex items-center justify-center md:justify-end z-10">
                  <div className="flex flex-col items-end">
                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 tracking-tighter tabular-nums drop-shadow-sm group-hover:from-white group-hover:to-blue-200 transition-colors duration-500">72<span className="text-4xl text-slate-600 font-medium">%</span></div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Match Rate</div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <TiltCard className="h-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-colors duration-700 pointer-events-none"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-grid pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 h-full flex flex-col max-w-[70%]">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-auto group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all duration-300 shadow-lg">
                    <Clock className="w-6 h-6 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-100 transition-colors">Adaptive Roadmaps</h3>
                    <p className="text-slate-400 text-base leading-relaxed">Personalized courses, projects, and tasks that adapt when you learn faster or slower.</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltCard className="h-full bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden group transition-all duration-500 shadow-2xl">
                {/* Ambient Glow */}
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-colors duration-700 pointer-events-none"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-grid pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-auto group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all duration-300 relative z-10 shadow-lg">
                  <Shield className="w-6 h-6 text-slate-400 group-hover:text-orange-300 transition-colors" />
                </div>
                
                <div className="relative z-10 mt-12">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-orange-100 transition-colors">Mock Interviews</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">Practice with our AI and get immediate rubric-based feedback.</p>
                </div>
              </TiltCard>
            </motion.div>

          </motion.div>
        </div>

        {/* ═══════════ HOW IT WORKS (Timeline) ═══════════ */}
        <div className="relative z-10 w-full mb-32">
            <Steps />
        </div>

        {/* ═══════════ STATS ═══════════ */}
        {/* ═══════════ STATS ═══════════ */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-32 px-6 max-w-6xl mx-auto">
          <div className="relative bg-[#050b14] border border-white/5 rounded-[2rem] p-10 md:p-12 overflow-hidden shadow-2xl">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-y-0 md:divide-x divide-white/10">
              <AnimatedCounter target={500} suffix="+" label="Active Users" />
              <AnimatedCounter target={12} suffix="+" label="Target Roles" />
              <AnimatedCounter target={95} suffix="%" label="Satisfaction" />
              <AnimatedCounter target={2000} suffix="+" label="Skills Tracked" />
            </div>
          </div>
        </motion.div>

        {/* ═══════════ TESTIMONIALS (WALL OF LOVE) ═══════════ */}
        <div className="mb-32 relative max-w-full overflow-hidden py-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Loved by developers worldwide.</h2>
            <p className="text-slate-400 text-lg">Join thousands of students who stopped guessing and started building.</p>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
            {/* Left and Right Fade Gradients */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>

            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-6 px-3 w-max hover:[animation-play-state:paused]"
            >
              {/* Duplicate the array to create seamless loop */}
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-6">
                  {/* Card 1 */}
                  <div className="w-80 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">"This completely changed how I study. The AI roadmap figured out exactly what I was missing for a Backend role and I landed an offer at Amazon 2 months later."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">A</div>
                      <div>
                        <div className="text-white text-sm font-bold">Alex Chen</div>
                        <div className="text-slate-500 text-xs">SDE I @ Amazon</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="w-80 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">"The resume parsing is mind-blowing. It caught skills I didn't even realize I had, and gave me a step-by-step path to my dream job in Data Science."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">S</div>
                      <div>
                        <div className="text-white text-sm font-bold">Sarah Jenkins</div>
                        <div className="text-slate-500 text-xs">Data Analyst</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 3 */}
                  <div className="w-80 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">"I was stuck in tutorial hell for a year. SkillPath gave me actual, practical projects tailored to my gaps. The mock interviews were the cherry on top."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">R</div>
                      <div>
                        <div className="text-white text-sm font-bold">Rahul Mehta</div>
                        <div className="text-slate-500 text-xs">Frontend Developer</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 4 */}
                  <div className="w-80 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">"Finally, a platform that doesn't just give you a generic list of courses. The dynamic learning path adapting to my speed was exactly what I needed."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">M</div>
                      <div>
                        <div className="text-white text-sm font-bold">Maria Garcia</div>
                        <div className="text-slate-500 text-xs">DevOps Engineer</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card 5 */}
                  <div className="w-80 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">"The UI is absolutely stunning, but the actual value is in the AI roadmap generation. It saved me hundreds of hours of figuring out what to learn next."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">D</div>
                      <div>
                        <div className="text-white text-sm font-bold">David Kim</div>
                        <div className="text-slate-500 text-xs">Full Stack Dev</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        {/* ═══════════ BOTTOM CTA ═══════════ */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-24 max-w-5xl mx-auto px-6 relative z-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#030712] shadow-2xl">
            {/* Minimalist Tech Background */}
            <div className="absolute inset-0 bg-grid opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
            
            {/* Subtle Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-blue-500/10 rounded-[100%] blur-[80px] pointer-events-none"></div>

            <div className="relative p-12 md:p-24 flex flex-col items-center text-center">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Your Dream Career Awaits</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight max-w-3xl mx-auto">
                Ready to ace your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">next interview?</span>
              </h2>
              
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto leading-relaxed">
                Join students who stopped guessing and started building real, structured paths to their dream careers.
              </p>
              
              <Link href="/onboarding">
                <button className="relative group overflow-hidden rounded-full bg-white text-[#030712] font-bold text-xl px-12 py-5 transition-transform hover:scale-105 shadow-xl hover:shadow-xl border border-white/50">
                  {/* Shimmer sweep effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  
                  <span className="relative z-10 flex items-center gap-3">
                    Start Now — It's Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-[#030712]" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

/* ────────────────────────────────────────────
   ANIMATED SVG CIRCLE
   ──────────────────────────────────────────── */
function AnimatedCircle({ strokeDasharray, color, delay }: { strokeDasharray: string, color: string, delay: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.circle ref={ref as any} cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
      initial={{ strokeDasharray: "0 251.2" }}
      animate={inView ? { strokeDasharray } : { strokeDasharray: "0 251.2" }}
      transition={{ type: "spring", bounce: 0.2, duration: 2, delay }}
    />
  );
}
