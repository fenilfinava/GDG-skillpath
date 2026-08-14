"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Bot, User, Loader2, ShieldAlert, Code2,
  AlertTriangle, Sparkles, Zap,
} from "lucide-react";
import { useResume } from "@/lib/ResumeContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  critique?: string;
  score?: number;
  timestamp: Date;
}

interface HistoryMessage {
  role: "user" | "model";
  content: string;
}

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: string;
  resumeSummary: string;
}

// ---------------------------------------------------------------------------
// Score Gauge
// ---------------------------------------------------------------------------
function ScoreGauge({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400";
  const glowColor = score >= 70 ? "rgba(52,211,153,0.4)" : score >= 40 ? "rgba(251,191,36,0.4)" : "rgba(248,113,113,0.4)";

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="none" className="text-white/5" />
        <motion.circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" className={color}
          style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span key={score} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-2xl font-black tabular-nums ${color}`}>
          {score}
        </motion.span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InterviewModal
// ---------------------------------------------------------------------------
export default function InterviewModal({ isOpen, onClose, targetRole, resumeSummary }: InterviewModalProps) {
  const { setInterviewScore } = useResume();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [whiteboardText, setWhiteboardText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("System Design");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ---------------------------------------------------------------------------
  // API call
  // ---------------------------------------------------------------------------
  const callInterviewAPI = useCallback(
    async (userResponse: string, currentHistory: HistoryMessage[]) => {
      setIsLoading(true);
      setError(null);

      const payload = {
        role: targetRole || "Software Development Engineer",
        topic,
        architectureDetails: resumeSummary || "",
        userResponse,
        history: currentHistory,
      };

      try {
        const res = await fetch("https://gdg-skillpath.onrender.com/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ detail: "Interview API error." }));
          throw new Error(errData.detail || `Server error: ${res.status}`);
        }

        const data = await res.json();

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: data.nextQuestion || data.interrogationQuestion || "No question returned.",
          critique: data.critique || "",
          score: data.score ?? 0,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setCurrentScore(data.score ?? 0);
        setInterviewScore(data.score ?? 0);

        // Append AI response to history for multi-turn
        setHistory((prev) => [...prev, { role: "model", content: data.nextQuestion || data.interrogationQuestion || "" }]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [targetRole, topic, resumeSummary, setInterviewScore]
  );

  // ---------------------------------------------------------------------------
  // Initial question on open
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      callInterviewAPI("", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Send user response
  // ---------------------------------------------------------------------------
  const handleSend = async () => {
    const text = userInput.trim();
    if (!text || isLoading) return;

    const fullResponse = whiteboardText.trim()
      ? `${text}\n\n[Whiteboard Notes]:\n${whiteboardText.trim()}`
      : text;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Build updated history with the user's message
    const updatedHistory: HistoryMessage[] = [...history, { role: "user", content: fullResponse }];
    setHistory(updatedHistory);
    setUserInput("");

    await callInterviewAPI(fullResponse, updatedHistory);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setHistory([]);
    setUserInput("");
    setWhiteboardText("");
    setCurrentScore(0);
    setError(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-[95vw] max-w-[1400px] h-[88vh] bg-[#060A13] border border-white/[0.08] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    AI Interview Simulator
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Role: {targetRole || "SDE"} • Topic: {topic} • <span className="text-slate-600">25CS056</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <select value={topic} onChange={(e) => setTopic(e.target.value)}
                  className="bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/40 cursor-pointer appearance-none">
                  <option value="System Design">System Design</option>
                  <option value="DSA">DSA</option>
                  <option value="OS">Operating Systems</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="DBMS">Database</option>
                </select>
                <ScoreGauge score={currentScore} />
                <button onClick={handleClose} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-500 flex items-center justify-center transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split-Screen Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left: Chat */}
              <div className="flex-1 flex flex-col border-r border-white/[0.06] min-w-0">
                <div className="px-6 py-3 border-b border-white/[0.04] bg-white/[0.01] shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5" /> Senior Staff Engineer Interrogation
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === "ai" ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/20" : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20"
                        }`}>
                        {msg.role === "ai" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${msg.role === "ai" ? "bg-white/[0.04] border border-white/[0.08]" : "bg-blue-500/10 border border-blue-500/20"
                        }`}>
                        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {msg.role === "ai" && msg.critique && (
                          <div className="mt-4 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3" /> Staff Engineer Critique
                            </p>
                            <p className="text-xs text-red-200/70 leading-relaxed">{msg.critique}</p>
                          </div>
                        )}
                        {msg.role === "ai" && msg.score !== undefined && msg.score > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400">Architecture Score: {msg.score}/100</span>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-600 mt-2 font-medium">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                        <span className="text-sm text-slate-400 font-medium">Interrogating your response...</span>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
                      {error}
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.015] shrink-0">
                  <div className="flex items-end gap-3">
                    <textarea ref={inputRef} value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="Defend your architecture... (Shift+Enter for newline)" rows={2}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 resize-none custom-scrollbar transition-colors"
                    />
                    <button onClick={handleSend} disabled={isLoading || !userInput.trim()}
                      className="w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none shrink-0">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Whiteboard */}
              <div className="w-[420px] flex flex-col bg-[#080C16] shrink-0">
                <div className="px-6 py-3 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" /> Whiteboard / Scratchpad
                  </p>
                  <button onClick={() => setWhiteboardText("")} className="text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-wider">Clear</button>
                </div>
                <textarea value={whiteboardText} onChange={(e) => setWhiteboardText(e.target.value)}
                  placeholder={`Draft your architecture notes here...\n\n┌─────────────┐     ┌──────────────┐\n│   Client     │────▶│  API Gateway │\n└─────────────┘     └──────┬───────┘\n                           │\n                    ┌──────▼───────┐\n                    │  Auth Service│\n                    └──────────────┘`}
                  className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-700 font-mono leading-relaxed p-6 focus:outline-none resize-none custom-scrollbar"
                  spellCheck={false}
                />
                <div className="px-6 py-4 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      <span className="text-purple-400 font-bold">Pro tip:</span> Your whiteboard notes are automatically included with your response for deeper architectural context.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
