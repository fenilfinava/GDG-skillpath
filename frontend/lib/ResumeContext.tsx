"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

export interface SkillGapItem {
  id: number;
  name: string;
  currentLevel: number;
  targetLevel: number;
  priority: string;
  category: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  type: string;
  duration: string;
  completed: boolean;
  recommended?: boolean;
  rationale?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  status: string;
  tasks: RoadmapTask[];
}

export interface ResumeState {
  skills: SkillItem[];
  gaps: SkillGapItem[];
  summary: string;
  targetRole: string;
  roadmapPhases: RoadmapPhase[];
  interviewScore: number;
  hasData: boolean;
}

interface ResumeContextValue extends ResumeState {
  setExtractedData: (data: { skills: SkillItem[]; gaps: SkillGapItem[]; summary: string }) => void;
  setRoadmapData: (phases: RoadmapPhase[]) => void;
  setInterviewScore: (score: number) => void;
  toggleTaskComplete: (phaseId: string, taskId: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ResumeContext = createContext<ResumeContextValue | null>(null);

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a <ResumeProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [summary, setSummary] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);
  const [interviewScore, setInterviewScoreState] = useState(0);
  const [hasData, setHasData] = useState(false);

  const setExtractedData = useCallback(
    (data: { skills: SkillItem[]; gaps: SkillGapItem[]; summary: string }) => {
      setSkills(data.skills || []);
      setGaps(data.gaps || []);
      setSummary(data.summary || "");
      setHasData(true);

      // Try to infer target role from the summary text
      const summaryLower = (data.summary || "").toLowerCase();
      if (summaryLower.includes("full stack") || summaryLower.includes("fullstack")) {
        setTargetRole("Full Stack Developer");
      } else if (summaryLower.includes("machine learning") || summaryLower.includes("ml engineer")) {
        setTargetRole("Machine Learning Engineer");
      } else if (summaryLower.includes("data analyst") || summaryLower.includes("data science")) {
        setTargetRole("Data Analyst");
      } else if (summaryLower.includes("frontend") || summaryLower.includes("front-end")) {
        setTargetRole("Frontend Developer");
      } else if (summaryLower.includes("backend") || summaryLower.includes("back-end")) {
        setTargetRole("Backend Developer");
      } else {
        setTargetRole("Software Development Engineer");
      }
    },
    []
  );

  const setRoadmapData = useCallback((phases: RoadmapPhase[]) => {
    setRoadmapPhases(phases);
  }, []);

  const setInterviewScore = useCallback((score: number) => {
    setInterviewScoreState(score);
  }, []);

  const toggleTaskComplete = useCallback((phaseId: string, taskId: string) => {
    setRoadmapPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : phase
      )
    );
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        skills,
        gaps,
        summary,
        targetRole,
        roadmapPhases,
        interviewScore,
        hasData,
        setExtractedData,
        setRoadmapData,
        setInterviewScore,
        toggleTaskComplete,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
