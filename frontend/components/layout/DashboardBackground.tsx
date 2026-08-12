"use client";
import { motion } from 'framer-motion';

export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#030712] -z-10"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      <motion.div animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
      <motion.div animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
      <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
    </div>
  );
}
