import os
import io
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pypdf
from google import genai
from google.genai import types
from dotenv import load_dotenv

# -----------------------------------------------------------------------------
# Absolute Path .env Loading (Fixes "GEMINI_API_KEY Missing" when launching Uvicorn)
# -----------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"), override=True)

# -----------------------------------------------------------------------------
# FastAPI App Initialization & CORS Setup
# -----------------------------------------------------------------------------
app = FastAPI(
    title="SkillPath Backend",
    description="FastAPI Backend for SkillPath powered by Gemini 2.5 Flash",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_gemini_client() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or not api_key.strip():
        raise HTTPException(
            status_code=400,
            detail="GEMINI_API_KEY environment variable is missing or unconfigured. Please add your GEMINI_API_KEY in backend/.env file."
        )
    return genai.Client(api_key=api_key.strip())


# -----------------------------------------------------------------------------
# Pydantic Schemas for Structured Outputs & API Contracts
# -----------------------------------------------------------------------------

# 1. Extract Endpoint Schemas
class SkillItem(BaseModel):
    id: str = Field(description="Unique skill identifier, e.g. '1'")
    name: str = Field(description="Name of the skill, e.g. 'React.js'")
    category: str = Field(description="Category of the skill, e.g. 'Frontend', 'Language', 'Database'")

class SkillGapItem(BaseModel):
    id: int = Field(description="Numeric skill gap ID")
    name: str = Field(description="Name of the required skill or gap area")
    currentLevel: int = Field(description="Current proficiency level from 0 to 100")
    targetLevel: int = Field(description="Target proficiency level from 0 to 100 required for role")
    priority: str = Field(description="Priority: 'Critical', 'Important', or 'Nice-to-have'")
    category: str = Field(description="Domain category, e.g. 'Core', 'Architecture', 'Cloud'")

class SkillExtractionResponse(BaseModel):
    skills: List[SkillItem] = Field(description="List of skills extracted from resume")
    gaps: List[SkillGapItem] = Field(description="Identified skill gaps compared to industry target roles")
    summary: str = Field(description="Executive summary of the candidate's technical profile")


# 2. Roadmap Endpoint Schemas
class ReactFlowNodeData(BaseModel):
    label: str = Field(description="Node title/label")
    title: str = Field(description="Detailed topic title")
    description: str = Field(description="Brief overview of topic")
    type: str = Field(description="Task type: 'course', 'project', 'practice', 'interview', or 'career'")
    duration: str = Field(description="Estimated completion time, e.g. '12 hrs'")
    priority: str = Field(description="Priority level: 'Critical', 'Important', or 'Nice-to-have'")
    status: str = Field(description="Status: 'completed', 'in-progress', or 'locked'")
    recommended: bool = Field(description="Whether this node is highly recommended by AI")
    rationale: str = Field(description="AI explanation for why this node is included in learning path")

class ReactFlowNodePosition(BaseModel):
    x: float = Field(description="X coordinate for canvas placement")
    y: float = Field(description="Y coordinate for canvas placement")

class ReactFlowNode(BaseModel):
    id: str = Field(description="Unique node ID")
    type: str = Field(default="custom", description="React Flow node type")
    data: ReactFlowNodeData
    position: ReactFlowNodePosition

class ReactFlowEdge(BaseModel):
    id: str = Field(description="Unique edge ID, e.g. 'e1-2'")
    source: str = Field(description="Source node ID")
    target: str = Field(description="Target node ID")
    animated: bool = Field(default=True, description="Whether edge line is animated")
    label: str = Field(default="Prerequisite", description="Relationship label")

class TaskItem(BaseModel):
    id: str = Field(description="Task ID, e.g. 't1'")
    title: str = Field(description="Task title")
    type: str = Field(description="Task type: 'course', 'project', 'practice', 'interview', 'career'")
    duration: str = Field(description="Duration string, e.g. '5 hrs'")
    completed: bool = Field(default=False)
    recommended: bool = Field(default=False)
    rationale: str = Field(default="")

class RoadmapPhase(BaseModel):
    id: str = Field(description="Phase ID, e.g. 'phase1'")
    title: str = Field(description="Phase title, e.g. 'Foundation', 'Intermediate'")
    status: str = Field(description="Phase status: 'completed', 'in-progress', 'locked'")
    tasks: List[TaskItem]

class RoadmapRequest(BaseModel):
    targetRole: str = Field(default="Software Development Engineer")
    skills: List[str] = Field(default_factory=list, description="Currently known skills")
    hoursPerWeek: int = Field(default=15)
    deadline: str = Field(default="4 months")

class RoadmapResponse(BaseModel):
    nodes: List[ReactFlowNode] = Field(description="React Flow nodes representation of non-linear learning path")
    edges: List[ReactFlowEdge] = Field(description="React Flow edges representing skill dependencies")
    phases: List[RoadmapPhase] = Field(description="Categorized phase list of learning tasks")


# 3. Interview Schemas (Multi-Turn with Chat Memory)
class ChatMessage(BaseModel):
    role: str = Field(description="Message sender: 'user' or 'model'")
    content: str = Field(description="Message text content")

class InterviewRequest(BaseModel):
    role: str = Field(default="Software Engineer")
    topic: str = Field(default="System Design")
    architectureDetails: str = Field(default="", description="The real project summaries from the resume extraction")
    userResponse: str = Field(default="", description="The candidate's latest answer")
    history: List[ChatMessage] = Field(default_factory=list, description="Previous chat messages for multi-turn context")

class InterviewQuestion(BaseModel):
    id: int = Field(description="Question ID")
    type: str = Field(description="'Technical', 'Behavioral', or 'System Design'")
    difficulty: str = Field(description="'Easy', 'Medium', or 'Hard'")
    question: str = Field(description="Interrogation question content")
    topic: str = Field(description="Topic focus, e.g. 'OS', 'System Design', 'DSA'")

class InterviewResponse(BaseModel):
    interrogationQuestion: str = Field(description="Ruthless Staff Engineer follow-up interrogation question")
    critique: str = Field(description="Staff Engineer critique highlighting flaws, single points of failure, or bottlenecks")
    score: int = Field(description="Architectural soundness score from 0 to 100")
    questions: List[InterviewQuestion] = Field(description="Suggested list of interview questions for target role")


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "SkillPath API is operational"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/extract", response_model=SkillExtractionResponse)
async def extract_skills(file: UploadFile = File(...)):
    """
    Parses an uploaded PDF resume, extracts skills and gap areas using Gemini 2.5 Flash.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Step 1: PDF Text Extraction
    try:
        contents = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(contents))
        pdf_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                pdf_text += text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")

    if not pdf_text.strip():
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF contains no extractable text. Please upload a text-based PDF resume."
        )

    # Step 2: Live AI Integration
    client = get_gemini_client()

    system_instruction = (
        "You are an elite Technical Recruiter. Analyze the provided resume text "
        "and extract the candidate's verified technical skills, categorized properly. "
        "Also identify 3-5 critical skill gaps by comparing against industry expectations "
        "for modern software engineering roles. Assign accurate currentLevel (0-100), "
        "targetLevel (0-100), and priority ('Critical', 'Important', or 'Nice-to-have'). "
        "Provide an executive summary of the candidate's technical profile. "
        "Be objective and do not hallucinate."
    )

    prompt = f"Analyze the following resume text and extract structured data:\n\nRESUME TEXT:\n{pdf_text}"

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=SkillExtractionResponse,
                temperature=0.2,
            )
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during extraction: {str(e)}")


@app.post("/api/roadmap", response_model=RoadmapResponse)
async def generate_roadmap(req: RoadmapRequest):
    """
    Generates a non-linear learning path (React Flow nodes/edges and phases) using Gemini 2.5 Flash.
    """
    client = get_gemini_client()
    skills_str = ", ".join(req.skills) if req.skills else "Basic programming skills"

    prompt = f"""
    You are an elite Tech Career Strategist. Design a personalized, non-linear learning roadmap for a candidate aiming for the role of '{req.targetRole}'.
    Candidate current skills: {skills_str}.
    Weekly commitment: {req.hoursPerWeek} hrs/week.
    Timeline: {req.deadline}.

    Generate:
    1. 'nodes': A list of React Flow canvas nodes laying out the learning graph visually across coordinates (x: 100..800, y: 100..600). Include node types ('course', 'project', 'practice', 'interview', 'career'), priority, status, and AI rationale.
    2. 'edges': Directed React Flow edges connecting dependent nodes (source node -> target node) representing prerequisite skill dependencies.
    3. 'phases': Grouped learning phases ('Foundation', 'Intermediate', 'Advanced', 'Interview Ready') with actionable task cards.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RoadmapResponse,
                temperature=0.3,
            )
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during roadmap generation: {str(e)}")


@app.post("/api/interview", response_model=InterviewResponse)
async def senior_staff_interrogation(req: InterviewRequest):
    """
    Multi-turn ruthless Senior Staff Engineer interview.
    Converts frontend chat history into google-genai types.Content format
    so the AI remembers and builds upon the entire conversation.
    """
    client = get_gemini_client()

    # --- Dynamic System Instruction (adapts to any student's resume) ---
    system_instruction = (
        "You are a ruthless Senior Staff Engineer at a FAANG company conducting a "
        "placement technical interview. Your goal is to aggressively interrogate the "
        "candidate on the specific architecture and technical details provided in their resume.\n\n"
        "Analyze their project details dynamically:\n"
        "- If their project mentions a multi-tenant platform, grill them heavily on "
        "database role isolation, Row Level Security, and data leakage.\n"
        "- If their project mentions C++ or hardware/logic simulations, relentlessly "
        "interrogate memory management, pointer safety, and virtual function overhead.\n"
        "- For web or distributed systems, target single points of failure, caching, "
        "latency, and scaling bottlenecks.\n\n"
        "DO NOT ask generic behavioral questions. Base your questions strictly on their "
        "previous responses and the technical vulnerabilities in their real projects.\n\n"
        f"Candidate Target Role: {req.role}\n"
        f"Interview Topic Focus: {req.topic}\n"
        f"Candidate Real Project Details from Resume:\n{req.architectureDetails or 'No project details provided.'}"
    )

    # --- Build multi-turn conversation history for Gemini ---
    conversation_contents: list[types.Content] = []

    # Replay past conversation turns from the frontend's history array
    for msg in req.history:
        gemini_role = "user" if msg.role == "user" else "model"
        conversation_contents.append(
            types.Content(
                role=gemini_role,
                parts=[types.Part.from_text(text=msg.content)]
            )
        )

    # Append the current user response as the latest turn
    if req.userResponse and req.userResponse.strip():
        current_prompt = req.userResponse
    else:
        # First turn: no user response yet, ask AI to open the interrogation
        current_prompt = (
            f"Begin the technical interrogation for the {req.role} role. "
            f"Focus on {req.topic}. Analyze the candidate's project details above "
            f"and ask your first aggressive, project-specific question."
        )

    conversation_contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=current_prompt)]
        )
    )

    # --- Call Gemini with full conversation context ---
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=conversation_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=InterviewResponse,
                temperature=0.5,
            )
        )
        return response.parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during interview interrogation: {str(e)}")