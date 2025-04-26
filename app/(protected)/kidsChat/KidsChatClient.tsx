"use client";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizonal, ClipboardCheck, X, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import MarkdownRenderer from "../../components/MarkdownRenderer";


interface Message {
  sender: "AI" | "You" | "separator";
  text: string;
}

export default function KidsChat() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "Nature";
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizText, setQuizText] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizGrade, setQuizGrade] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);

  const hasInitialized = useRef(false);

  async function checkApiAllowance(userId: string): Promise<boolean> {
    const res = await fetch("/api/usage/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.allowed === true;
  }

  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const clearAndFetchIntro = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_memory/clear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": session.user.id,
          },
        });

        const allowed = await checkApiAllowance(session.user.id);
        if (!allowed) {
          setMessages([{ sender: "AI", text: "🚫 You've reached your daily limit. Come back tomorrow!" }]);
          return;
        }

        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_intro?subject=${encodeURIComponent(subject)}`, {
          headers: { "x-user-id": session.user.id },
        });

        const data = await res.json();
        setMessages([{ sender: "AI", text: data.message }]);
        hasInitialized.current = true;
      } catch {
        setMessages([{ sender: "AI", text: "Sorry, I couldn't load the introduction." }]);
      } finally {
        setLoading(false);
      }
    };

    clearAndFetchIntro();
  }, [subject, session]);

  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 You've reached your daily limit. Try again tomorrow!" }]);
      return;
    }

    setMessages((prev) => [...prev, { sender: "You", text: userInput }]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_chat?subject=${encodeURIComponent(subject)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "AI", text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "AI", text: "Oops! Something went wrong." }]);
    }

    setLoading(false);
  };

  const startQuiz = async () => {
    if (!session?.user?.id) return;

    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 You've hit your daily limit. Try again tomorrow!" }]);
      return;
    }

    setShowQuizModal(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_quiz/start?subject=${encodeURIComponent(subject)}`, {
        headers: { "x-user-id": session.user.id },
      });

      const data = await res.json();
      setQuizText(data.quiz);
    } catch {
      setQuizText("Sorry, couldn't generate the quiz.");
    }
  };

  const submitQuiz = async () => {
    if (!session?.user?.id) return;

    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setQuizFeedback("🚫 Daily limit reached. Try again tomorrow!");
      setQuizGrade("");
      return;
    }

    setQuizLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_quiz/submit?subject=${encodeURIComponent(subject)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      const data = await res.json();
      setQuizFeedback(data.feedback);
      setQuizGrade(data.grade);
    } catch {
      setQuizFeedback("Something went wrong submitting your answers.");
      setQuizGrade("");
    }

    setQuizLoading(false);
  };

  const continueLesson = async () => {
    setShowQuizModal(false);
    setQuizText("");
    setQuizAnswers(["", "", "", "", ""]);
    setQuizFeedback("");
    setQuizGrade("");

    if (!session?.user?.id) return;

    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 Limit reached. Try again tomorrow!" }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_continue?subject=${encodeURIComponent(subject)}`, {
        headers: { "x-user-id": session.user.id },
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "separator", text: "--- 🎉 Welcome Back From the Quiz! Let's keep learning! ---" },
        { sender: "AI", text: data.message },
      ]);
    } catch {
      setMessages((prev) => [...prev, { sender: "AI", text: "Oops! Couldn't continue lesson." }]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center container mx-auto p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">🌱 Kids Learning: {subject}</h2>

      <div className="w-full max-w-3xl bg-white border-4 border-emerald-300 rounded-3xl shadow-xl p-6 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2" style={{ maxHeight: "60vh" }}>
          {messages.map((msg, idx) =>
            msg.sender === "separator" ? (
              <div key={idx} className="text-center text-green-500 py-2 font-semibold">{msg.text}</div>
            ) : (
              <div
                key={idx}
                className={`p-3 rounded-xl shadow-sm ${
                  msg.sender === "AI" ? "bg-green-50 text-green-600" : "bg-teal-50 text-gray-700"
                }`}
              >
                <div className="flex flex-wrap gap-1 items-start">
                  <strong className="shrink-0">{msg.sender}:</strong>
                  {msg.sender === 'AI' ? (
                    <div className="flex-1 overflow-x-hidden">
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  ) : (
                    <span className="flex-1">{msg.text}</span>
                  )}
                </div>
              </div>
            )
          )}
          {loading && <div className="text-emerald-600 animate-pulse">AI is typing...</div>}
        </div>

        <div className="flex items-center">
          <textarea
            className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 shadow-sm resize-y overflow-y-auto"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your answer or question!"
            rows={1}
            style={{ minHeight: "3.2rem", maxHeight: "10rem" }}
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white rounded-xl p-3 hover:bg-green-600 shadow-md transition duration-200 flex items-center"
          >
            Send <SendHorizonal className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        onClick={startQuiz}
        className="mt-6 bg-emerald-500 text-white rounded-xl py-3 px-5 hover:bg-emerald-600 shadow-lg flex items-center transition duration-200"
      >
        Take Quiz <ClipboardCheck className="ml-2 h-5 w-5" />
      </button>

      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-green-700">📝 Your Quiz</h3>
            <div className="bg-gray-100 p-4 mb-3 rounded whitespace-pre-wrap">
              <MarkdownRenderer content={quizText} />
            </div>
            {quizAnswers.map((answer, i) => (
              <input
                key={i}
                type="text"
                className="w-full border border-gray-300 rounded p-2 mb-4 mt-2"
                placeholder={`Answer for question ${i + 1}`}
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...quizAnswers];
                  newAnswers[i] = e.target.value;
                  setQuizAnswers(newAnswers);
                }}
              />
            ))}
            <button
              onClick={submitQuiz}
              className="bg-emerald-500 text-white rounded-xl p-2 hover:bg-emerald-600 shadow-md mt-1"
            >
              {quizLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Submit Answers"}
            </button>
            {quizFeedback && (
              <div className="mt-4 p-4 bg-green-100 rounded text-emerald-800 space-y-4">
                <div>
                  <strong>Feedback:</strong>
                  <div className="whitespace-pre-wrap">
                    <MarkdownRenderer content={quizFeedback} />
                  </div>
                </div>
                <div>
                  <strong>Grade:</strong>
                  <div className="whitespace-pre-wrap">
                    <MarkdownRenderer content={quizGrade} />
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={continueLesson}
              className="mt-5 bg-lime-500 text-white rounded-xl p-2 hover:bg-lime-600 shadow-md flex items-center"
            >
              Close <X className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
