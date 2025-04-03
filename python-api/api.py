import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

import casualLearning

import warnings
warnings.filterwarnings("ignore")


# Global variables to hold quiz state
last_quiz = ""
last_quiz_feedback = ""
last_quiz_grade = ""

class TutorRequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        query_params = parse_qs(parsed.query)
        # Get the subject from the URL, defaulting to Astronomy if missing
        subject = query_params.get("subject", ["Astronomy"])[0]
        path = parsed.path

        if path == "/intro":
            try:
                intro_text = casualLearning.intro_chain.run({"subject": subject})
                # Save context to memory
                casualLearning.memory.save_context({"userResponse": ""}, {"chat_history": intro_text})
                response = {"message": intro_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/quiz/start":
            global last_quiz
            try:
                last_quiz = casualLearning.quizGen_chain.run({
                    "subject": subject, 
                    "previousChat": casualLearning.memory.chat_memory
                })
                response = {"quiz": last_quiz}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/continue":
            global last_quiz_feedback, last_quiz_grade
            try:
                continue_text = casualLearning.continueIntro_chain.run({
                    "subject": subject,
                    "quizFeedback": last_quiz_feedback,
                    "quizGrade": last_quiz_grade,
                    "chat_history": casualLearning.memory.chat_memory
                })
                casualLearning.memory.save_context({"userResponse": ""}, {"chat_history": continue_text})
                response = {"message": continue_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404, "Endpoint not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        query_params = parse_qs(parsed.query)
        subject = query_params.get("subject", ["Astronomy"])[0]
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)
        try:
            data = json.loads(post_data.decode("utf-8"))
        except Exception:
            data = {}

        if path == "/chat":
            user_message = data.get("message", "")
            if not user_message:
                self.send_error(400, "Missing 'message' in request body")
                return
            try:
                response_text = casualLearning.response_chain.run({
                    "subject": subject,
                    "userResponse": user_message
                })
                response = {"message": response_text}
                self._set_headers()
                self.wfile.write(json.dumps(response).encode("utf-8"))
            except Exception as e:
                self.send_error(500, str(e))
        elif path == "/quiz/submit":
            answers = data.get("answers", [])
            if not isinstance(answers, list) or len(answers) != 5:
                self.send_error(400, "Expected 'answers' as a list of 5 answers")
                return
            try:
                global last_quiz_feedback, last_quiz_grade
                last_quiz_feedback = casualLearning.quizFeedback_chain.run({
                    "subject": subject,
                    "previousChat": casualLearning.memory.chat_memory,
                    "generatedQuiz": last_quiz,
                    "userAnswers": answers
                })
                last_quiz_grade = casualLearning.quizGrade_chain.run({
                    "subject": subject,
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
