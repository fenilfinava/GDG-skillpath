"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, X, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hi Aditi! I'm your career assistant. How can I help you accelerate your path to Software Development Engineer today?" }
  ]);
  const [inputText, setInputText] = useState("");

  const suggestions = [
    "Review my skill gaps",
    "Generate a practice question",
    "Explain System Design"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { sender: "user" as const, text }];
    setMessages(newMessages);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "That's a great question! Based on your profile, I recommend prioritizing your Data Structures & Algorithms gaps first. Would you like me to generate a Tree traversal problem?";
      if (text.toLowerCase().includes("skill gap") || text.toLowerCase().includes("review")) {
        botResponse = "Looking at your Skill Gap analysis, your target role is Software Development Engineer. Your biggest gap is in System Design (20% current vs 75% target) and DSA (40% vs 90%). I recommend starting the DSA: Trees & Graphs course.";
      } else if (text.toLowerCase().includes("question") || text.toLowerCase().includes("practice")) {
        botResponse = "Here's a DSA question for you: 'Write a function to detect a cycle in a linked list.' You can view this inside the Interview Prep hub or write your answer here!";
      } else if (text.toLowerCase().includes("system design")) {
        botResponse = "System Design is crucial for SDE roles. I recommend starting with 'System Design Fundamentals' in your roadmap. We cover Horizontal vs Vertical scaling, load balancers, and caching.";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] cursor-pointer transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-[#0A0D14]/90 backdrop-blur-3xl border border-white/[0.08] rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">SkillPath AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex items-start gap-3 max-w-[85%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "")}>
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-purple-400")}>
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn("px-4 py-3 rounded-2xl text-sm leading-relaxed", msg.sender === "user" ? "bg-blue-600/20 border border-blue-500/20 text-white rounded-tr-none" : "bg-white/5 border border-white/[0.05] text-slate-300 rounded-tl-none")}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="text-xs px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.05] hover:border-white/10 rounded-full text-slate-300 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div className="p-4 bg-white/[0.01] border-t border-white/[0.05] flex gap-2">
              <input
                type="text"
                placeholder="Ask anything about your roadmap..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
                className="flex-1 bg-[#111]/60 border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleSend(inputText)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
