/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/kidsChat/KidsChatClient.tsx
 ************************************************************/


/**
 * KidsChatClient.tsx – Handles the main chat interface for the Kids Tutor mode.
 * 
 * Features:
 * - Initializes AI lesson based on selected subject
 * - Manages chat message flow between user and AI
 * - Integrates API limit checking per user
 * - Offers an interactive quiz modal with grading and feedback
 * - Tracks stats and updates badges based on usage and performance
 */


"use client";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizonal, ClipboardCheck, X, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import MarkdownRenderer from "../../components/MarkdownRenderer";


// Defines the format of a single message in the chat history
interface Message {
  sender: "AI" | "You" | "separator";
  text: string;
}



/**
 * Extracts a numeric percentage grade from a string like "Grade: 80%"
 * @param gradeText - The full grade text string
 * @returns The numeric grade (0–100) or null if not found
 */
function extractNumericGrade(gradeText: string): number | null {
  // Look for something like "Grade: 100%"
  const gradePattern = /Grade:\s*(\d+)%/i;

  // Try to match the pattern in the input text
  const match = gradeText.match(gradePattern);

  // If there's a match, convert it to a number and return it
  if (match) {
    return parseInt(match[1], 10);
  }

  // If no match found, return null
  return null;
}


/**
 * Main chat component for kids learning mode.
 * Handles API interactions, user messages, quiz system, and AI-generated replies.
 */
export default function KidsChat() {
  // Set Session and Subject-related hooks
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "Nature";
  const { data: session } = useSession();

  // Chat state variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Quiz-related state variables
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizText, setQuizText] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizGrade, setQuizGrade] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);

  const hasInitialized = useRef(false);


  /**
   * Checks if the user has remaining API requests for the day.
   * @param userId - The user's Supabase ID
   * @returns True if allowed, false otherwise
   */
  async function checkApiAllowance(userId: string): Promise<boolean> {
    const res = await fetch("/api/usage/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.allowed === true;
  }


  /**
   * On initial load, clears memory, logs the subject, updates badges, and fetches intro.
   */
  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const clearAndFetchIntro = async () => {
      try {

        //Clear memory
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_memory/clear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": session.user.id,
          },
        });

        //Update User's Topic Stat
        await fetch("/api/stats/topic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id, topic: subject }),
        });
        

        //Check API Limit
        const allowed = await checkApiAllowance(session.user.id);
        if (!allowed) {
          setMessages([{ sender: "AI", text: "🚫 You've reached your daily limit. Come back tomorrow!" }]);
          return;
        }

        //Generate Intro
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_intro?subject=${encodeURIComponent(subject)}`, {
          headers: { "x-user-id": session.user.id },
        });

        //Recieve and Display Intro
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


  
  /**
   * Handles the sending of a message by the user and receives AI response.
   */
  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 You've reached your daily limit. Try again tomorrow!" }]);
      return;
    }

    //Add message to conversation
    setMessages((prev) => [...prev, { sender: "You", text: userInput }]);
    setUserInput("");
    setLoading(true);

    try {
      //Generate response
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_chat?subject=${encodeURIComponent(subject)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      //Recieve and Display response
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "AI", text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "AI", text: "Oops! Something went wrong." }]);
    }

    setLoading(false);
  };

  
  /**
   * Opens the quiz modal and fetches quiz questions from the backend.
   */
  const startQuiz = async () => {
    if (!session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 You've hit your daily limit. Try again tomorrow!" }]);
      return;
    }

    setShowQuizModal(true);

    try {
      //Generate quiz
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_quiz/start?subject=${encodeURIComponent(subject)}`, {
        headers: { "x-user-id": session.user.id },
      });

      //Recieve and Display Quiz
      const data = await res.json();
      setQuizText(data.quiz);
    } catch {
      setQuizText("Sorry, couldn't generate the quiz.");
    }
  };


  
  /**
   * Submits the user's quiz answers and processes feedback and grading.
   */
  const submitQuiz = async () => {
    if (!session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setQuizFeedback("🚫 Daily limit reached. Try again tomorrow!");
      setQuizGrade("");
      return;
    }

    setQuizLoading(true);

    try {
      //Generate Feedback and Grade
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_quiz/submit?subject=${encodeURIComponent(subject)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      //Recieve and Display Feedback and Grade
      const data = await res.json();
      setQuizFeedback(data.feedback);
      setQuizGrade(data.grade);

      //Update user Quiz Stats
      await fetch("/api/stats/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });


      //Extract out the user's numeric grade
      const numericGrade = extractNumericGrade(data.grade);
      
      //Update user badges
      await fetch("/api/badges/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          extra: { grade: numericGrade },
        }),
      });
      
    } catch {
      setQuizFeedback("Something went wrong submitting your answers.");
      setQuizGrade("");
    }

    setQuizLoading(false);
  };


  
  /**
   * Closes the quiz modal and fetches continuation message from the tutor.
   */
  const continueLesson = async () => {
    //Clear previous quiz data
    setShowQuizModal(false);
    setQuizText("");
    setQuizAnswers(["", "", "", "", ""]);
    setQuizFeedback("");
    setQuizGrade("");

    if (!session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, { sender: "AI", text: "🚫 Limit reached. Try again tomorrow!" }]);
      return;
    }

    setLoading(true);
    try {
      //Generate Post Quiz Continuation
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/kids_continue?subject=${encodeURIComponent(subject)}`, {
        headers: { "x-user-id": session.user.id },
      });

      //Recieve and Display Continuation
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

  //Kids Learning UI
  return (
    <div className="w-full min-h-screen flex flex-col items-center container mx-auto p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">🌱 Kids Learning: {subject}</h2>

      {/* Chat Interface */}
      <div className="w-full max-w-3xl bg-white border-4 border-emerald-300 rounded-3xl shadow-xl p-6 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2" style={{ maxHeight: "60vh" }}>
          {messages.map((msg, idx) =>
            msg.sender === "separator" ? (
              <div key={idx} className="text-center text-green-500 py-2 font-semibold">{msg.text}</div>
            ) : (
              <div
                key={idx}
                className={`p-3 rounded-xl shadow-sm ${
                  msg.sender === "AI" ? "bg-green-50 text-emerald-600" : "bg-teal-50 text-gray-700"
                }`}
              >
                <div className="flex flex-wrap gap-1 items-start">
                  <strong className="shrink-0">{msg.sender}:</strong>
                  {msg.sender === 'AI' ? (
                    <div className="flex-1 overflow-x-hidden break-words">
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

        {/* Text Input */}
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

      {/* Quiz Button */}
      <button
        onClick={startQuiz}
        className="mt-6 bg-emerald-500 text-white rounded-xl py-3 px-5 hover:bg-emerald-600 shadow-lg flex items-center transition duration-200"
      >
        Take Quiz <ClipboardCheck className="ml-2 h-5 w-5" />
      </button>

      {/* Quiz Pop Up */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-green-700">📝 Your Quiz</h3>
            <div className="bg-gray-100 p-4 mb-3 rounded break-words">
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
                  <div className="break-words">
                    <MarkdownRenderer content={quizFeedback} />
                  </div>
                </div>
                <div>
                  <strong>Grade:</strong>
                  <div className="break-words">
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
