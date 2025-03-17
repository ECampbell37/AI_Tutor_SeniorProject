import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

import casualLearning  # This imports your casualLearning.py module

# Global variables to hold quiz state
last_quiz = ""
last_quiz_feedback = ""
last_quiz_grade = ""

class TutorRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins (for development)
        self.end_headers()

    # Handle CORS preflight requests
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == "/intro":
            # Generate introductory message
            try:
                intro_text = casualLearning.intro_chain.run({"subject": casualLearning.subject})
                # Save context to memory
                casualLearning.memory.save_context({"userResponse": ""}, {"chat_history": intro_text})
                response = {"message": intro_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/quiz/start":
            # Generate quiz questions and store in global variable
            global last_quiz
            try:
                last_quiz = casualLearning.quizGen_chain.run({
                    "subject": casualLearning.subject, 
                    "previousChat": casualLearning.memory.chat_memory
                })
                response = {"quiz": last_quiz}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/continue":
            # Generate continuation message after quiz
            global last_quiz_feedback, last_quiz_grade
            try:
                continue_text = casualLearning.continueIntro_chain.run({
                    "subject": casualLearning.subject,
                    "quizFeedback": last_quiz_feedback,
                    "quizGrade": last_quiz_grade,
                    "chat_history": casualLearning.memory.chat_memory
                })
                # Save updated context
                casualLearning.memory.save_context({"userResponse": ""}, {"chat_history": continue_text})
                response = {"message": continue_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)
        try:
            data = json.loads(post_data.decode("utf-8"))
        except Exception:
            data = {}
        
        if path == "/chat":
            # Handle chat message: expect { "message": "user text" }
            user_message = data.get("message", "")
            if not user_message:
                self.send_error(400, "Missing 'message' in request body")
                return
            try:
                response_text = casualLearning.response_chain.run({
                    "subject": casualLearning.subject, 
                    "userResponse": user_message
                })
                response = {"message": response_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/quiz/submit":
            # Process quiz submission: expect { "answers": ["A", "B", "C", "D", "E"] }
            answers = data.get("answers", [])
            if not isinstance(answers, list) or len(answers) != 5:
                self.send_error(400, "Expected 'answers' as a list of 5 answers")
                return
            try:
                global last_quiz_feedback, last_quiz_grade
                last_quiz_feedback = casualLearning.quizFeedback_chain.run({
                    "subject": casualLearning.subject,
                    "previousChat": casualLearning.memory.chat_memory,
                    "generatedQuiz": last_quiz,
                    "userAnswers": answers
                })
                last_quiz_grade = casualLearning.quizGrade_chain.run({
                    "subject": casualLearning.subject,
                    "quizFeedback": last_quiz_feedback
                })
                response = {"feedback": last_quiz_feedback, "grade": last_quiz_grade}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404, "Endpoint not found")

def run(server_class=HTTPServer, handler_class=TutorRequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting tutor API server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
