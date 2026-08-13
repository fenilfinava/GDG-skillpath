import os
import unittest
from unittest.mock import MagicMock, patch
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
        self.assertIn("service", response.json())

    @patch("main.get_gemini_client")
    def test_extract_endpoint(self, mock_get_client):
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_response = MagicMock()
        mock_response.text = '{"skills": [{"id": "1", "name": "Python", "category": "Language"}], "gaps": [{"id": 1, "name": "System Design", "currentLevel": 30, "targetLevel": 80, "priority": "Critical", "category": "Architecture"}], "summary": "Strong developer"}'
        mock_client.models.generate_content.return_value = mock_response

        # Sample minimal valid PDF content
        pdf_bytes = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n00000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF\n"
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
        mock_response = MagicMock()
        mock_response.text = '''{
            "nodes": [{
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
                    "recommended": true,
                    "rationale": "Essential for SDE"
                },
                "position": {"x": 100.0, "y": 150.0}
            }],
            "edges": [{
                "id": "e1-2",
                "source": "1",
                "target": "2",
                "animated": true,
                "label": "Prerequisite"
            }],
            "phases": [{
                "id": "phase1",
                "title": "Foundation",
                "status": "in-progress",
                "tasks": [{
                    "id": "t1",
                    "title": "Trees & Graphs",
                    "type": "practice",
                    "duration": "10 hrs",
                    "completed": false,
                    "recommended": true,
                    "rationale": "Crucial for interviews"
                }]
            }]
        }'''
        mock_client.models.generate_content.return_value = mock_response

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
        self.assertIn("edges", data)
        self.assertIn("phases", data)

    @patch("main.get_gemini_client")
    def test_interview_endpoint(self, mock_get_client):
        mock_client = MagicMock()
        mock_get_client.return_value = mock_client
        mock_response = MagicMock()
        mock_response.text = '''{
            "interrogationQuestion": "How does your system handle database connection pool exhaustion under high concurrency?",
            "critique": "Your design lacks circuit breakers and connection pooling limits.",
            "score": 65,
            "questions": [{
                "id": 1,
                "type": "System Design",
                "difficulty": "Hard",
                "question": "Design a distributed rate limiter.",
                "topic": "System Design"
            }]
        }'''
        mock_client.models.generate_content.return_value = mock_response

        payload = {
            "role": "Software Development Engineer",
            "topic": "System Design",
            "architectureDetails": "Microservices with PostgreSQL database",
            "userResponse": "We use basic Connection Pool in Node.js"
        }
        response = client.post("/api/interview", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("interrogationQuestion", data)
        self.assertIn("critique", data)
        self.assertEqual(data["score"], 65)

    def test_missing_api_key_400(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": "PASTE_YOUR_NEW_GEMINI_API_KEY_HERE"}):
            payload = {"targetRole": "Software Development Engineer", "skills": ["Python"]}
            response = client.post("/api/roadmap", json=payload)
            self.assertEqual(response.status_code, 400)
            self.assertIn("missing or unconfigured", response.json()["detail"])

if __name__ == "__main__":
    unittest.main()
