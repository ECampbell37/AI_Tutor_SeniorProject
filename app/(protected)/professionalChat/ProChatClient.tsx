/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/professionalChat/ProChatClient.tsx
 ************************************************************/


/**
 * ProChatClient.tsx – Handles the main chat interface for the Professional Tutor mode.
 *
 * This React client component provides an advanced tutoring experience tailored for technical users.
 * It supports clear markdown output, math and code rendering, and contextual conversation via a Python backend.
 *
 * Key Features:
 * - Secure user session integration via NextAuth
 * - API rate limiting using daily usage checks
 * - Automatic conversation memory clearing on session start
 * - Interactive chat interface with markdown/code highlighting and LaTeX support
 */


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { SendHorizonal } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

//Message Format (sender and text)
interface Message {
  sender: 'AI' | 'User';
  text: string;
}

export default function ProfessionalChat() {
  //Session
  const { data: session } = useSession();

  //Chat State Variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  
  /**
   * Checks if the user has remaining API requests for the day.
   * @param userId - The user's Supabase ID
   * @returns True if allowed, false otherwise
   */
  async function checkApiAllowance(userId: string): Promise<boolean> {
    const res = await fetch('/api/usage/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    return data.allowed === true;
  }


  /**
   * Clears previous memory for this user on first load and shows a welcome message.
   */
  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const initializeMemory = async () => {
      try {
        //Clear memory
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/professional_chat/memory/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session.user.id,
          },
        });

        //Welcome Message
        setMessages([{
          sender: 'AI',
          text: "👋 Welcome to Professional Mode! Ask advanced questions about math, coding, coursework, career help, or complex concepts — I'm here to assist like a subject-matter expert. Ask away! 😊",
        }]);

        hasInitialized.current = true;
      } catch {
        setMessages([{
          sender: 'AI',
          text: 'Sorry, I could not start the session.',
        }]);
      }
    };

    initializeMemory();
  }, [session]);


  /**
   * Sends the user's message to the AI and handles the response.
   */
  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    //Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily API limit. Please come back tomorrow!",
      }]);
      return;
    }

    //Add user message to conversation
    const userText = userInput;
    setMessages((prev) => [...prev, { sender: 'User', text: userText }]);
    setUserInput('');
    setLoading(true);

    try {
      //Generate AI Response
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/professional_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ message: userText }),
      });

      //Recieve and Display AI Response
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'AI', text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Oops! Something went wrong.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl 2xl:max-w-5xl flex flex-col flex-grow p-6 2xl:p-10">
        <h2 className="text-4xl 2xl:text-5xl font-semibold mb-6 2xl:mb-10 text-gray-800 text-center">
          🎓 Professional Tutor
        </h2>

        {/* Chat Interface */}
        <div className="flex flex-col bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 2xl:p-8 flex-grow overflow-hidden animate-fadeIn">
          <div className="overflow-y-auto mb-4 flex-1 space-y-2 2xl:space-y-3" style={{ maxHeight: '60vh' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 2xl:p-4 rounded-xl shadow-sm 2xl:text-lg ${
                  msg.sender === 'AI' ? 'bg-purple-50 text-purple-800' : 'bg-teal-50 text-gray-700'
                }`}
              >
                <div className="flex flex-wrap gap-1 items-start">
                  <strong className="shrink-0">{msg.sender}:</strong>
                  {msg.sender === 'AI' ? (
                    <div className="flex-1 overflow-x-hidden break-words space-y-2 2xl:text-lg">
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  ) : (
                    <span className="flex-1 2xl:text-lg">{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-purple-600 animate-pulse 2xl:text-lg">AI is typing...</div>}
          </div>

          {/* Text Input */}
          <div className="flex items-center mt-2 2xl:my-auto">
            <textarea
              className="flex-1 border border-gray-300 rounded-xl p-3 2xl:p-4 mr-2 shadow-sm resize-y overflow-y-auto 2xl:text-lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask a professional question..."
              rows={1}
              style={{ minHeight: '3.2rem', maxHeight: '10rem' }}
            />
            <button
              onClick={sendMessage}
              className="bg-purple-500 text-white rounded-xl p-3 2xl:p-4 hover:bg-purple-600 shadow-md transition duration-200 flex items-center 2xl:text-base"
            >
              Send <SendHorizonal className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
