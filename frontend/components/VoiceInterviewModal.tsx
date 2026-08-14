"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2,
  ShieldAlert, AlertTriangle, Zap, Sparkles, Send, RefreshCw
} from "lucide-react";
import { useResume, type SkillGapItem } from "@/lib/ResumeContext";

// ---------------------------------------------------------------------------
// Speech Recognition Types (Web Speech API Polyfill Declarations)
// ---------------------------------------------------------------------------
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

// ---------------------------------------------------------------------------
// Interfaces
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

interface VoiceInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Score Radial Gauge
// ---------------------------------------------------------------------------
function ScoreGauge({ score }: { score: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400";
  const glowColor = score >= 70 ? "rgba(52,211,153,0.4)" : score >= 40 ? "rgba(251,191,36,0.4)" : "rgba(248,113,113,0.4)";

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="5" fill="none" className="text-white/5" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          className={color}
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span key={score} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-xl font-black tabular-nums ${color}`}>
          {score}
        </motion.span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VoiceInterviewModal Component
// ---------------------------------------------------------------------------
export default function VoiceInterviewModal({ isOpen, onClose }: VoiceInterviewModalProps) {
  const { targetRole, summary, gaps, setInterviewScore } = useResume();

  // Determine fallback values for empty ResumeState (for quick testing)
  const finalRole = targetRole && targetRole.trim() ? targetRole : "Software Engineer";
  const summaryText = summary && summary.trim() 
    ? summary 
    : "Candidate is a Full-Stack Software Developer experienced in building web applications, backend microservices, and databases.";
  
  const gapNamesText = gaps && gaps.length > 0
    ? gaps.map((g: SkillGapItem | string) => (typeof g === "string" ? g : g.name)).join(", ")
    : "Distributed Caching, System Scalability, Microservice Fault Tolerance, Database Optimization";

  const architectureDetails = `RESUME SUMMARY: ${summaryText} | IDENTIFIED SKILL GAPS TO PROBE: ${gapNamesText}`;

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Speech & Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, liveTranscript]);

  // Text-To-Speech (TTS) engine
  const speakText = useCallback((text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop any existing speech

    const cleanText = text.replace(/[*_#`]/g, ""); // Strip markdown formatting for voice
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  // API Call Handler
  const callInterviewAPI = useCallback(
    async (userResponse: string, currentHistory: HistoryMessage[]) => {
      setIsLoading(true);
      setError(null);

      const payload = {
        role: finalRole,
        topic: "Resume Review & Skill Gap Defense",
        architectureDetails: architectureDetails,
        userResponse: userResponse,
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
        const questionText = data.nextQuestion || data.interrogationQuestion || "Tell me about your technical project architecture.";

        setCurrentScore((prevScore) => {
          let newScore = prevScore;
          if (typeof data.scoreChange === "number") {
            newScore = Math.max(0, Math.min(100, prevScore + data.scoreChange));
          } else if (typeof data.score === "number") {
            newScore = data.score;
          }
          setInterviewScore(newScore);
          return newScore;
        });

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: questionText,
          critique: data.critique || "",
          score: data.scoreChange ?? data.score ?? 0,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setHistory((prev) => [...prev, { role: "model", content: questionText }]);

        // Automatically speak AI response out loud
        speakText(questionText);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [finalRole, architectureDetails, setInterviewScore, speakText]
  );

  // Initial trigger when modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      callInterviewAPI("", []);
    }
  }, [isOpen, messages.length, callInterviewAPI]);

  // Handle submitting user's spoken or typed response
  const handleUserTurn = async (spokenText: string) => {
    const text = spokenText.trim();
    if (!text || isLoading) return;

    // Stop speaking AI voice if candidate is talking
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLiveTranscript("");
    setTextInput("");
    transcriptRef.current = "";

    const updatedHistory: HistoryMessage[] = [...history, { role: "user", content: text }];
    setHistory(updatedHistory);

    await callInterviewAPI(text, updatedHistory);
  };

  // Toggle Microphone Listening (Click 1: Start continuous, Click 2: Stop & Send)
  const toggleListening = () => {
    if (isListening) {
      // Manual stop by user (Click 2) -> stop recognition & send transcript to API
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Detach default onend to avoid duplicate triggers
        recognitionRef.current.stop();
      }

      const textToSend = transcriptRef.current.trim();
      if (textToSend) {
        handleUserTurn(textToSend);
      }
      return;
    }

    // Stop AI speech if playing
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; // Stay active even when user pauses to think
      recognition.interimResults = true;
      recognition.lang = "en-US";

      transcriptRef.current = "";
      setLiveTranscript("");
      setError(null);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentText = "";
        for (let i = 0; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        transcriptRef.current = currentText;
        setLiveTranscript(currentText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== "no-speech") {
          setError(`Microphone error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: unknown) {
      setIsListening(false);
      const msg = err instanceof Error ? err.message : "Failed to access microphone.";
      setError(msg);
    }
  };

  // Replay AI's last question
  const replayLastQuestion = () => {
    const lastAiMsg = [...messages].reverse().find((m) => m.role === "ai");
    if (lastAiMsg) {
      speakText(lastAiMsg.content);
    }
  };

  // Close & reset
  const handleClose = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setMessages([]);
    setHistory([]);
    setCurrentScore(0);
    setError(null);
    setIsLoading(false);
    setIsListening(false);
    setIsSpeaking(false);
    setLiveTranscript("");
    setTextInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={handleClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-5xl h-[90vh] bg-[#060A13] border border-white/10 rounded-3xl shadow-[0_0_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
          >
            {/* Ambient Animated Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2">
                    AI Voice Interviewer
                    <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Browser Native Voice
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Target Role: <span className="text-slate-200 font-semibold">{finalRole}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ScoreGauge score={currentScore} />

                {/* Mute/Unmute Audio */}
                <button
                  onClick={() => {
                    if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                    setIsMuted(!isMuted);
                  }}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    isMuted
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                  }`}
                  title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Close Modal */}
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Context Banner */}
            <div className="px-6 py-2.5 bg-blue-500/5 border-b border-blue-500/10 flex items-center justify-between text-xs text-slate-400 shrink-0 relative z-10">
              <div className="flex items-center gap-2 truncate pr-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-blue-300">Resume Context Active:</strong> Probing skill gaps ({gapNamesText.slice(0, 70)}...)
                </span>
              </div>
              {isSpeaking && (
                <div className="flex items-center gap-1.5 text-blue-400 font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  AI Speaking...
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
              
              {/* Left Column: Interactive Mic Voice Hub */}
              <div className="w-full md:w-[420px] p-6 border-r border-white/[0.08] flex flex-col items-center justify-between bg-white/[0.01] shrink-0">
                
                {/* Voice Status Header */}
                <div className="text-center mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-1">
                    Voice Interface
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {isListening
                      ? "Listening... Tap mic to send"
                      : isSpeaking
                      ? "Interrogator is speaking..."
                      : isLoading
                      ? "Analyzing response..."
                      : "Tap mic to answer"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    {isListening
                      ? "Speak freely (pauses allowed). Tap mic again when finished to send your answer."
                      : "Press the microphone button below to record your technical response."}
                  </p>
                </div>

                {/* Central Microphone with Pulsing Aura */}
                <div className="relative my-8 flex items-center justify-center">
                  {/* Outer Pulsing Rings */}
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                          className="absolute w-36 h-36 rounded-full bg-red-500/30 border border-red-500/50"
                        />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 2.1, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          className="absolute w-36 h-36 rounded-full bg-orange-500/20 border border-orange-500/40"
                        />
                      </>
                    )}

                    {isSpeaking && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0.6 }}
                        animate={{ scale: 1.4, opacity: 0.1 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="absolute w-36 h-36 rounded-full bg-blue-500/30 border border-blue-500/50"
                      />
                    )}
                  </AnimatePresence>

                  {/* Mic Button */}
                  <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-2xl ${
                      isListening
                        ? "bg-gradient-to-tr from-red-600 to-orange-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse"
                        : isSpeaking
                        ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-[0_0_50px_rgba(37,99,235,0.6)]"
                        : isLoading
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/10"
                        : "bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:scale-105"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                    ) : isListening ? (
                      <MicOff className="w-12 h-12" />
                    ) : (
                      <Mic className="w-12 h-12" />
                    )}
                  </button>
                </div>

                {/* Live Speech Preview Box */}
                <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 min-h-[90px] flex flex-col justify-center text-center relative overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                    {isListening ? "Live Transcription" : "Speech Preview"}
                  </span>
                  <p className="text-xs text-slate-200 italic font-medium line-clamp-3">
                    {liveTranscript
                      ? `"${liveTranscript}"`
                      : isListening
                      ? "Listening... Speak now..."
                      : "Click microphone to start speaking."}
                  </p>
                </div>

                {/* Voice Action Controls */}
                <div className="w-full flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={replayLastQuestion}
                    disabled={isSpeaking || isLoading || messages.length === 0}
                    className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replay Question
                  </button>
                </div>
              </div>

              {/* Right Column: Live Conversation Transcript */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#04070F]">
                
                {/* Transcript Header */}
                <div className="px-6 py-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-blue-400" /> Live Interview Transcript
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {messages.length} Turn{messages.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                          msg.role === "ai"
                            ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/20"
                            : "bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-500/20"
                        }`}
                      >
                        {msg.role === "ai" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                          msg.role === "ai"
                            ? "bg-white/[0.04] border border-white/[0.08]"
                            : "bg-blue-600/10 border border-blue-500/20"
                        }`}
                      >
                        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                        {/* Staff Critique */}
                        {msg.role === "ai" && msg.critique && (
                          <div className="mt-3.5 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3" /> Senior Staff Critique
                            </p>
                            <p className="text-xs text-red-200/80 leading-relaxed">{msg.critique}</p>
                          </div>
                        )}

                        {/* Score Tag */}
                        {msg.role === "ai" && msg.score !== undefined && msg.score > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400">Architecture Soundness: {msg.score}/100</span>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-600 mt-2 block font-medium">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-4 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-xs text-slate-400 font-medium">Staff Engineer analyzing your answer...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Error Notification */}
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {!speechSupported && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-300">
                      Speech Recognition is not supported in this browser. You can type your answers in the input box below.
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Fallback Text Input Bar */}
                <div className="p-4 border-t border-white/[0.06] bg-white/[0.015] shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (textInput.trim()) {
                        handleUserTurn(textInput);
                      }
                    }}
                    className="flex items-center gap-3"
                  >
                    <input
                      ref={textInputRef}
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your response or use mic above..."
                      disabled={isLoading}
                      className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !textInput.trim()}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
