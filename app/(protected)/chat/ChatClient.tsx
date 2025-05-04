/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/chat/ChatClient.tsx
 ************************************************************/


"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SendHorizonal, ClipboardCheck, X, Loader2 } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer';


//Message Format (sender and text)
interface Message {
  sender: 'AI' | 'User' | 'separator';
  text: string;
}

//Casual Learning Chat Component
export default function Chat() {
  //Set up hooks
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || 'Astronomy';
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizText, setQuizText] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<string[]>(['', '', '', '', '']);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizGrade, setQuizGrade] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);

  const hasInitialized = useRef(false);

  //Check User's API Limit
  async function checkApiAllowance(userId: string): Promise<boolean> {
    const res = await fetch('/api/usage/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    return data.allowed === true;
  }


  //Clear Previous Memory and Generate Lesson Intro
  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const clearAndFetchIntro = async () => {
      try {

        //Clear memory
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/memory/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session.user.id,
          },
        });


        //Add the current subject to user stats
        await fetch('/api/stats/topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, topic: subject }),
        });


        //Update User's Profile Badges
        await fetch('/api/badges/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id }),
        });
        

        //If over API Limit, do not generate intro
        const allowed = await checkApiAllowance(session.user.id);
        if (!allowed) {
          setMessages([{ sender: 'AI', text: "🚫 You've reached your daily API limit. Try again tomorrow!" }]);
          return;
        }

        //Generate Intro
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/intro?subject=${encodeURIComponent(subject)}`, {
          headers: { 'x-user-id': session.user.id },
        });

        //Recieve the Intro and Display it
        const data = await res.json();
        setMessages([{ sender: 'AI', text: data.message }]);
        hasInitialized.current = true;
      } catch {
        setMessages([{ sender: 'AI', text: "Sorry, I couldn't load the introduction." }]);
      } finally {
        setLoading(false);
      }
    };

    clearAndFetchIntro();
  }, [subject, session]);



  //User sends message tp chat
  const sendMessage = async () => {
    //If no message or user, skip
    if (!userInput.trim() || !session?.user?.id) return;

    //If over API Limit, do not handle response
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily message limit. Please come back tomorrow!",
      }]);
      return;
    }

    //Otherwise, add the user's message to the conversation
    setMessages((prev) => [...prev, { sender: 'User', text: userInput }]);
    setUserInput('');
    setLoading(true);

    //Generate AI Response
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/chat?subject=${encodeURIComponent(subject)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      //Recieve and Display AI Response
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'AI', text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Oops! Something went wrong.' }]);
    }

    setLoading(false);
  };


  //Open the quiz pop-up
  const openQuizModal = async () => {
    if (!session?.user?.id) return;

    //If API Limit reached, no quiz
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily API limit. Please come back tomorrow!",
      }]);
      return;
    }

    setShowQuizModal(true);

    //Generate Quiz
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/quiz/start?subject=${encodeURIComponent(subject)}`, {
        headers: { 'x-user-id': session.user.id },
      });

      //Recieve and Display Quiz
      const data = await res.json();
      setQuizText(data.quiz);
    } catch {
      setQuizText('Sorry, something went wrong generating the quiz.');
    }
  };


  //Handle Quiz Submission
  const submitQuiz = async () => {
    if (!session?.user?.id) return;

    //If API Limit reached, no ai response
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setQuizFeedback("🚫 You've reached your daily API limit. Try again tomorrow!");
      setQuizGrade('');
      return;
    }

    setQuizLoading(true);

    //Generate Feedback and Grade
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/quiz/submit?subject=${encodeURIComponent(subject)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ answers: quizAnswers }),
      });

      //Recieve and Display Feedback and Grade
      const data = await res.json();
      setQuizFeedback(data.feedback);
      setQuizGrade(data.grade);

      //Update User Quiz Stats
      await fetch('/api/stats/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });


      //Update User Quiz Badges
      await fetch('/api/badges/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          extra: { score: data.grade },
        }),
      });
      

    } catch {
      setQuizFeedback('Something went wrong submitting your answers.');
      setQuizGrade('');
    }

    setQuizLoading(false);
  };


  //Handle Quiz End
  const closeQuizModal = async () => {
    //Reset all quiz fields
    setShowQuizModal(false);
    setQuizText('');
    setQuizAnswers(['', '', '', '', '']);
    setQuizFeedback('');
    setQuizGrade('');

    if (!session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily API limit. Please come back tomorrow!",
      }]);
      return;
    }

    setLoading(true);

    //Generate Post Quiz Continuation Text
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/continue?subject=${encodeURIComponent(subject)}`, {
        headers: { 'x-user-id': session.user.id },
      });

      //Recieve and Display Post Quiz Continuation in chat
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'separator', text: '--- Welcome Back from the Quiz! ---' },
        { sender: 'AI', text: data.message },
      ]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Oops! Couldn’t continue the lesson.' }]);
    }

    setLoading(false);
  };

  //Casual Learning UI
  return (
    <div className="min-h-screen flex flex-col items-center container mx-auto p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <h2 className="text-4xl font-semibold mb-6 text-gray-800">📖 Casual Learning: {subject}</h2>

      {/* Chat Interface */}
      <div className="w-full max-w-4xl bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2" style={{ maxHeight: '60vh' }}>
        {messages.map((msg, idx) =>
          msg.sender === 'separator' ? (
            <div key={idx} className="text-center text-gray-400 py-2">{msg.text}</div>
          ) : (
            <div
              key={idx}
              className={`p-3 rounded-xl shadow-sm ${
                msg.sender === 'AI' ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-gray-700'
              }`}
            >
              <div className="flex flex-wrap gap-1 items-start">
                <strong className="shrink-0">{msg.sender}:</strong>
                {msg.sender === 'AI' ? (
                  <div className="flex-1 overflow-x-hidden break-words whitespace-pre-line">
                    <MarkdownRenderer content={msg.text} />
                  </div>
                ) : (
                  <span className="flex-1">{msg.text}</span>
                )}
              </div>
            </div>
          )
        )}
          {loading && <div className="text-blue-600 animate-pulse">AI is typing...</div>}
        </div>

        {/* Text Input */}
        <div className="flex items-center">
          <textarea
            className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 shadow-sm resize-y overflow-y-auto"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your message..."
            rows={1}
            style={{ minHeight: '3.2rem', maxHeight: '10rem' }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-xl p-3 hover:bg-blue-600 shadow-md transition duration-200 flex items-center"
          >
            Send <SendHorizonal className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quiz Button */}
      <button
        onClick={openQuizModal}
        className="mt-6 bg-cyan-500 text-white rounded-xl py-3 px-5 hover:bg-cyan-600 shadow-lg flex items-center transition duration-200"
      >
        Take Quiz <ClipboardCheck className="ml-2 h-5 w-5" />
      </button>

      {/* Quiz Pop Up */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4">Quiz</h3>
            <div className="bg-gray-100 p-4 mb-3 rounded whitespace-pre-line">
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
              className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 shadow-md mt-1"
            >
              {quizLoading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Submit Answers'}
            </button>
            {quizFeedback && (
              <div className="mt-4 p-4 bg-blue-100 rounded space-y-4">
                <div>
                  <strong>Feedback:</strong>
                  <div className="break-words whitespace-pre-line">
                    <MarkdownRenderer content={quizFeedback} />
                  </div>
                </div>
                <div>
                  <strong>Grade:</strong>
                  <div className="break-words whitespace-pre-line">
                    <MarkdownRenderer content={quizGrade} />
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={closeQuizModal}
              className="mt-5 bg-red-500 text-white rounded-xl p-2 hover:bg-red-600 shadow-md flex items-center"
            >
              Close <X className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
