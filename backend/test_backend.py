import os
import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestBackendEndpoints(unittest.TestCase):

    def test_health_check(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_root(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())

    @patch("main.pypdf.PdfReader")
    @patch("main.get_gemini_client")
    def test_extract_endpoint(self, mock_get_client, mock_pdf_reader_cls):
        mock_reader = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "Experienced Python & React Engineer with 5 years experience."
        mock_reader.pages = [mock_page]
        mock_pdf_reader_cls.return_value = mock_reader

        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_parsed = MagicMock()
        mock_parsed.skills = [{"id": "1", "name": "Python", "category": "Language"}]
        mock_parsed.gaps = []
        mock_parsed.summary = "Strong developer"

        mock_client.aio.models.generate_content = AsyncMock(return_value=MagicMock(parsed=mock_parsed))

        pdf_bytes = b"%PDF-1.4 dummy pdf bytes"
        response = client.post(
            "/api/extract",
            files={"file": ("resume.pdf", pdf_bytes, "application/pdf")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("skills", data)
        self.assertEqual(data["skills"][0]["name"], "Python")

    @patch("main.get_gemini_client")
    def test_roadmap_endpoint(self, mock_get_client):
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_parsed = MagicMock()
        mock_parsed.nodes = [{
            "id": "1",
            "type": "custom",
            "data": {
                "label": "Data Structures",
                "title": "DSA Deep Dive",
                "description": "Learn Trees & Graphs",
                "type": "practice",
                "duration": "10 hrs",
                "priority": "Critical",
                "status": "in-progress",
                "recommended": True,
                "rationale": "Essential for SDE"
            },
            "position": {"x": 100.0, "y": 150.0}
        }]
        mock_parsed.edges = []
        mock_parsed.phases = []

        mock_client.aio.models.generate_content = AsyncMock(return_value=MagicMock(parsed=mock_parsed))

        payload = {
            "targetRole": "Software Development Engineer",
            "skills": ["Python", "JavaScript"],
            "hoursPerWeek": 15,
            "deadline": "4 months"
        }
        response = client.post("/api/roadmap", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("nodes", data)

    @patch.dict(os.environ, {"GROQ_API_KEY": "fake_groq_key"})
    @patch("main.OpenAI")
    def test_interview_endpoint(self, mock_openai_cls):
        mock_openai_inst = MagicMock()
        mock_openai_cls.return_value = mock_openai_inst
        mock_choice = MagicMock()
        mock_choice.message.content = '{"critique": "Good response", "scoreChange": 10, "nextQuestion": "Tell me about scalable architecture"}'
        mock_openai_inst.chat.completions.create.return_value = MagicMock(choices=[mock_choice])

        payload = {
            "role": "Software Development Engineer",
            "topic": "System Design",
            "architectureDetails": "Microservices",
            "userResponse": "Connection pooling"
        }
        response = client.post("/api/interview", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("nextQuestion", data)
        self.assertEqual(data["scoreChange"], 10)

    def test_missing_api_key_400(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
            payload = {"targetRole": "Software Development Engineer", "skills": ["Python"]}
            response = client.post("/api/roadmap", json=payload)
            self.assertEqual(response.status_code, 400)
            self.assertIn("missing or unconfigured", response.json()["detail"])

    def test_signup_and_login(self):
        import uuid
        test_email = f"testuser_{uuid.uuid4().hex[:6]}@example.com"
        
        # Test Signup
        signup_payload = {
            "name": "Alex Developer",
            "email": test_email,
            "password": "securepassword123",
            "targetRole": "Fullstack Engineer"
        }
        res_signup = client.post("/api/auth/signup", json=signup_payload)
        self.assertEqual(res_signup.status_code, 200)
        data_signup = res_signup.json()
        self.assertEqual(data_signup["status"], "success")
        self.assertIn("token", data_signup)
        self.assertEqual(data_signup["user"]["email"], test_email)
        token = data_signup["token"]

        # Test Duplicate Signup
        res_dup = client.post("/api/auth/signup", json=signup_payload)
        self.assertEqual(res_dup.status_code, 400)

        # Test Login
        login_payload = {
            "email": test_email,
            "password": "securepassword123"
        }
        res_login = client.post("/api/auth/login", json=login_payload)
        self.assertEqual(res_login.status_code, 200)
        data_login = res_login.json()
        self.assertEqual(data_login["status"], "success")
        self.assertEqual(data_login["user"]["name"], "Alex Developer")

        # Test GET /api/auth/me with active session token
        active_token = data_login["token"]
        res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {active_token}"})
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.json()["email"], test_email)

if __name__ == "__main__":
    unittest.main()
