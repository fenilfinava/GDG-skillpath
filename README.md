# SkillPath 🚀

<div align="center">
  <p><strong>Stop Guessing. Start Achieving.</strong></p>
  <p>AI-driven learning roadmaps generated instantly from your resume to bridge the gap between where you are and your dream tech job.</p>
</div>

---

## 🌟 Features

- **📄 AI Resume Parsing:** Automatically extract your skills and map them against industry standards.
- **🗺️ Adaptive Roadmaps:** Get personalized, dynamic learning paths that evolve with your progress.
- **🎯 Skill Gap Analysis:** See exactly what you need to learn for your target role (Software Engineer, DevOps, Data Science, etc.).
- **🎤 Mock Interviews:** Practice with our AI Voice & Video Interviewer and receive instant rubric-based feedback.
- **✨ Premium UI/UX:** Built with Glassmorphism, 3D tilt effects, scroll-driven animations, and an immersive bento grid layout.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Authentication:** Supabase Auth
- **Data Visualization:** Recharts

### Backend
- **Framework:** FastAPI (Python)
- **AI Integration:** Google Gemini / Anthropic API
- **Deployment:** Render (Backend) / Vercel (Frontend)

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
The frontend will be running on `http://localhost:3000`.

### 3. Setup the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
The backend API will be running on `http://localhost:8000`.

---

## 🎨 UI/UX Highlights
- **Scroll-driven Parallax:** The landing page features an immersive code editor that scales on scroll.
- **Bento Grid Layout:** Clean, Apple-inspired feature grid.
- **Physics-based Animations:** Realistic spring physics applied to hover states and card tilts.
- **React Portals:** Secure z-index handling for full-screen immersive modals.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ for the Developer Community.*
