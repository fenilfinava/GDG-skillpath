"use client";
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

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
  resumeId: string | null;
  roadmapId: string | null;
  skills: SkillItem[];
  gaps: SkillGapItem[];
  summary: string;
  targetRole: string;
  roadmapPhases: RoadmapPhase[];
  interviewScore: number;
  hasData: boolean;
  isLoading: boolean;
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
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [roadmapId, setRoadmapId] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [summary, setSummary] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>([]);
  const [interviewScore, setInterviewScoreState] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data on Mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // Load Resume
        const { data: resumeData } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (resumeData) {
          setResumeId(resumeData.id);
          setSkills(resumeData.skills || []);
          setGaps(resumeData.skill_gaps || []);
          setSummary(resumeData.summary || "");
          setHasData(true);
          
          const summaryLower = (resumeData.summary || "").toLowerCase();
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
          }
        }

        // Load Roadmap
        const { data: roadmapData } = await supabase
          .from("roadmaps")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (roadmapData) {
          setRoadmapId(roadmapData.id);
          setRoadmapPhases(roadmapData.phases || []);
          if(roadmapData.target_role) setTargetRole(roadmapData.target_role);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const setExtractedData = useCallback(
    async (data: { skills: SkillItem[]; gaps: SkillGapItem[]; summary: string }) => {
      setSkills(data.skills || []);
      setGaps(data.gaps || []);
      setSummary(data.summary || "");
      setHasData(true);

      let newRole = "Software Development Engineer";
      const summaryLower = (data.summary || "").toLowerCase();
      if (summaryLower.includes("full stack") || summaryLower.includes("fullstack")) newRole = "Full Stack Developer";
      else if (summaryLower.includes("machine learning") || summaryLower.includes("ml engineer")) newRole = "Machine Learning Engineer";
      else if (summaryLower.includes("data analyst") || summaryLower.includes("data science")) newRole = "Data Analyst";
      else if (summaryLower.includes("frontend") || summaryLower.includes("front-end")) newRole = "Frontend Developer";
      else if (summaryLower.includes("backend") || summaryLower.includes("back-end")) newRole = "Backend Developer";
      
      setTargetRole(newRole);

      // Persist to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: insertedData, error } = await supabase
          .from("resumes")
          .insert({
            user_id: session.user.id,
            skills: data.skills || [],
            skill_gaps: data.gaps || [],
            summary: data.summary || ""
          })
          .select()
          .single();
          
        if (insertedData) setResumeId(insertedData.id);
        if (error) console.error("Error saving resume to Supabase:", error);
      }
    },
    []
  );

  const setRoadmapData = useCallback(async (phases: RoadmapPhase[]) => {
    setRoadmapPhases(phases);
    
    // Persist to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      if (roadmapId) {
        await supabase
          .from("roadmaps")
          .update({ phases, updated_at: new Date().toISOString() })
          .eq("id", roadmapId);
      } else {
        const { data: insertedData, error } = await supabase
          .from("roadmaps")
          .insert({
            user_id: session.user.id,
            target_role: targetRole,
            phases: phases
          })
          .select()
          .single();
          
        if (insertedData) setRoadmapId(insertedData.id);
        if (error) console.error("Error saving roadmap to Supabase:", error);
      }
    }
  }, [roadmapId, targetRole]);

  const setInterviewScore = useCallback((score: number) => {
    setInterviewScoreState(score);
  }, []);

  const toggleTaskComplete = useCallback(async (phaseId: string, taskId: string) => {
    setRoadmapPhases((prev) => {
      const newPhases = prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : phase
      );
      
      // Async update in background
      if (roadmapId) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            supabase
              .from("roadmaps")
              .update({ phases: newPhases, updated_at: new Date().toISOString() })
              .eq("id", roadmapId)
              .then(); // fire and forget
          }
        });
      }
      
      return newPhases;
    });
  }, [roadmapId]);

  return (
    <ResumeContext.Provider
      value={{
        resumeId,
        roadmapId,
        skills,
        gaps,
        summary,
        targetRole,
        roadmapPhases,
        interviewScore,
        hasData,
        isLoading,
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
