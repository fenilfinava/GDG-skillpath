"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightTiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  disableTilt?: boolean;
}

export function SpotlightTiltCard({ children, className, spotlightColor = "rgba(139, 92, 246, 0.15)", disableTilt = false, style, ...rest }: SpotlightTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);

  const xPctSpring = useSpring(xPct, { stiffness: 300, damping: 20 });
  const yPctSpring = useSpring(yPct, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(yPctSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(xPctSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    xPct.set(x / rect.width - 0.5);
    yPct.set(y / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    xPct.set(0);
    yPct.set(0);
  };

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 40%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
        transformStyle: disableTilt ? "flat" : "preserve-3d",
        ...style
      }}
      className={cn(
        "relative overflow-hidden transition-colors duration-300 group",
        className
      )}
      {...rest}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{ background }}
      />
      <div style={{ transform: disableTilt ? "none" : "translateZ(30px)", transformStyle: disableTilt ? "flat" : "preserve-3d" }} className="w-full h-full relative z-10 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
