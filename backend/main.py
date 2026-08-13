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
        response = await client.aio.models.generate_content(
            model="gemini-3.6-flash",
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
        response = await client.aio.models.generate_content(
            model="gemini-3.6-flash",
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


import json
import os
from openai import OpenAI
from fastapi import HTTPException

@app.post("/api/interview")
async def interview_endpoint(req: InterviewRequest):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="GROQ_API_KEY missing in .env")
    
    client = OpenAI(api_key=api_key.strip(), base_url="https://api.groq.com/openai/v1")

    # 1. System Prompt
    system_instruction = f"""
    You are a Senior HR Manager conducting a Round 2 behavioral interview.
    Target Role: {req.role}
    Resume Context: {req.architectureDetails}

    INCREMENTAL SCORING RULES:
    Evaluate the candidate's latest response and issue a POINT ADJUSTMENT (`scoreChange`) based on answer quality:
    * Great STAR Answer (Clear context, personal action, quantifiable result): +10 to +15 points
    * Good/Acceptable Answer (Relevant and clear, minor details missing): +5 to +8 points
    * Weak/Vague Answer (Missing key details or lacks ownership): -3 to -5 points
    * Wrong / Off-topic / Single-word Answer: -5 to -10 points (Deduct points gently, DO NOT reset to 0)

    INTERVIEW RULES:
    1. Acknowledge their response and explain why points were added or deducted in your `critique`.
    2. Read the Conversation History below and NEVER ask a question that was already asked.
    3. Keep spoken responses short (1-3 sentences max) so text-to-speech stays natural.

    CONVERSATION HISTORY:
    {req.history}

    You MUST return your response strictly as a JSON object with this exact structure:
    {{
        "critique": "Your brief spoken reaction explaining the point change",
        "scoreChange": 5, 
        "nextQuestion": "Your next question for the candidate"
    }}
    """

    try:
        # 2. Call Groq
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": req.userResponse}
            ],
            response_format={"type": "json_object"},
            temperature=0.6,
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API Error: {str(e)}")

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
        response = await client.aio.models.generate_content(
            model="gemini-3.6-flash",
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