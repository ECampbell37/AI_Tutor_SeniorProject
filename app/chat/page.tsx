// app/chat/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

interface Message {
  sender: 'AI' | 'User';
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Quiz modal state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizText, setQuizText] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<string[]>(['', '', '', '', '']);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizGrade, setQuizGrade] = useState('');

  // On page load, fetch the introductory message if not already fetched.
  useEffect(() => {
    if ((window as any).__introFetched) return;
    (window as any).__introFetched = true;

    fetch('http://localhost:8000/intro')
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: 'AI', text: data.message }]);
      })
      .catch((err) => console.error('Error fetching intro:', err));
  }, []);

  // Send a chat message to /chat endpoint
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = { sender: 'User', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await res.json();
      const aiMessage: Message = { sender: 'AI', text: data.message };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setLoading(false);
  };

  // Open the quiz modal and fetch quiz questions from /quiz/start
  const openQuizModal = async () => {
    setShowQuizModal(true);
    try {
      const res = await fetch('http://localhost:8000/quiz/start');
      const data = await res.json();
      setQuizText(data.quiz);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    }
  };

  // Submit quiz answers to /quiz/submit endpoint
  const submitQuiz = async () => {
    try {
      const res = await fetch('http://localhost:8000/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await res.json();
      setQuizFeedback(data.feedback);
      setQuizGrade(data.grade);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  // Close the quiz modal and fetch the continuation message from /continue
  const closeQuizModal = () => {
    setShowQuizModal(false);
    fetch('http://localhost:8000/continue')
      .then((res) => res.json())
      .then((data) => {
        const contMessage: Message = { sender: 'AI', text: data.message };
        setMessages((prev) => [...prev, contMessage]);
      })
      .catch((err) => console.error('Error fetching continuation:', err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      <h2 className="text-4xl font-semibold mb-4">Chat with AI Tutor</h2>
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded p-4 mb-4 flex flex-col" style={{ flex: 1 }}>
        <div className="flex-1 overflow-y-auto p-2 mb-4" style={{ maxHeight: '70vh' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.sender === 'AI' ? 'text-blue-600' : 'text-green-600'}`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && <div className="text-blue-600">AI is typing...</div>}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded p-2 mr-2"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white rounded p-2">
            Send
          </button>
        </div>
      </div>
      <button onClick={openQuizModal} className="mb-4 bg-green-500 text-white rounded p-2">
        Take Quiz
      </button>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4">Quiz</h3>
            <pre className="bg-gray-100 p-4 mb-4 whitespace-pre-wrap">{quizText}</pre>
            <div>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-4">
                  <label className="block mb-1">Question {i + 1} Answer:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={quizAnswers[i]}
                    onChange={(e) => {
                      const newAnswers = [...quizAnswers];
                      newAnswers[i] = e.target.value;
                      setQuizAnswers(newAnswers);
                    }}
                  />
                </div>
              ))}
            </div>
            <button onClick={submitQuiz} className="bg-blue-500 text-white rounded p-2 mt-4 mr-2">
              Submit Quiz
            </button>
            {quizFeedback && (
              <div className="mt-4">
                <h4 className="font-semibold">Feedback:</h4>
                <pre className="bg-gray-100 p-4 whitespace-pre-wrap">{quizFeedback}</pre>
                <h4 className="font-semibold">Grade:</h4>
                <p>{quizGrade}</p>
              </div>
            )}
            <button onClick={closeQuizModal} className="bg-red-500 text-white rounded p-2 mt-4">
              Close Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
