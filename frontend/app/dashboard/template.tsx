"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
