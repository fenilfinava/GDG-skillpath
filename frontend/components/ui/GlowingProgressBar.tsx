"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingProgressBarProps {
  value: number; // 0 to 100
  targetValue?: number; // 0 to 100 (optional)
  className?: string;
  barClassName?: string;
  glowColor?: string; // e.g. "rgba(59, 130, 246, 0.5)"
}

export function GlowingProgressBar({ value, targetValue, className, barClassName, glowColor = "rgba(59, 130, 246, 0.5)" }: GlowingProgressBarProps) {
  return (
    <div className={cn("w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden relative border border-white/5", className)}>
      {/* Target Line */}
      {targetValue !== undefined && (
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-20" 
          style={{ left: `${targetValue}%` }}
        />
      )}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn("h-full rounded-full relative bg-gradient-to-r from-blue-500 to-cyan-400", barClassName)}
      >
        {/* Shimmer effect */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent z-10"
        />
        {/* Glowing Head at the tip */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white z-10" 
          style={{ boxShadow: `0 0 12px 6px ${glowColor}` }}
        />
      </motion.div>
    </div>
  );
}
