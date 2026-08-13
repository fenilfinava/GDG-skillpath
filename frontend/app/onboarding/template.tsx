"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0, scale: 0.99, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
