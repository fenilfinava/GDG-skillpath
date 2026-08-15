# SkillPath 🚀

<div align="center">
  <p><strong>Stop Guessing. Start Achieving.</strong></p>
  <p>AI-driven learning roadmaps generated instantly from your resume to bridge the gap between where you are and your dream tech job.</p>
</div>

---

## 🌟 What is SkillPath & Use Cases
SkillPath is an intelligent career progression platform designed for students, job seekers, and professionals looking to upskill or switch roles. 

**Use Cases (Where is it used?):**
- **Students & Freshers:** To figure out exactly what industry skills they are missing to land their first job.
- **Working Professionals:** To plan a structured learning path when transitioning careers (e.g., from Frontend to DevOps).
- **Interview Preparation:** To practice real-world mock interviews tailored specifically to their target role.

## 🚀 Current Features
- **📄 AI Resume Parsing:** Automatically extract your skills and map them against industry standards.
- **🗺️ Adaptive Topic Roadmaps:** Get personalized learning topics based on your current skill gaps.
- **🎯 Skill Gap Analysis:** See exactly what you need to learn for your target role.
- **🎤 Mock Interviews:** Practice with our AI Voice & Video Interviewer and receive instant rubric-based feedback.
- **✨ Premium UI/UX:** Built with Glassmorphism, 3D tilt effects, scroll-driven animations, and an immersive Apple-inspired layout.

## 🔮 Future Roadmap (Upcoming Features)
We are actively building the next generation of features to make SkillPath even more powerful:
- **🧠 Custom Trained AI Models:** We will be training our own specialized models for these specific tasks to drastically increase roadmap accuracy and contextual awareness.
- **🏢 Real Company Interview Questions:** Integrating a curated, dynamic database of actual interview questions recently asked by top tech companies.
- **📚 Deep-Dive Resource Tracking (The "How-to"):** Currently, we generate topic roadmaps. Soon, we will provide the *exact execution plan* (e.g., if the topic is DSA, we will tell you *where* to learn it, *how* to study it, and *which specific questions* to practice).

## 🛠️ Tech Stack
### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Authentication:** Supabase Auth

### Backend
- **Framework:** FastAPI (Python)
- **AI Integration:** Google Gemini / Anthropic API
- **Deployment:** Render (Backend) / Vercel (Frontend)

---

## 👨‍💻 Contributors & Team
This project was brought to life by:
- **Fenil Finava** - Core Developer & Collaborator
- **Hardik Parmar** - Core Developer & Collaborator

*(A massive shoutout to both for their hard work, architecture design, and dedication in building this platform!)*

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and Python 3.9+ installed.

### 1. Clone the repository
```bash
git clone https://github.com/fenilfinava/GDG-skillpath.git
cd GDG-skillpath
```

### 2. Setup the Frontend
```bash
cd frontend
npm install

# Create a .env.local file with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

npm run dev
```

### 3. Setup the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---
*Built with ❤️ for the Developer Community.*
