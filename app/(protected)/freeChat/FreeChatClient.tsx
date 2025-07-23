/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/freeChat/FreeChatClient.tsx
 ************************************************************/



/**
 * FreeChatClient.tsx – React component for the AI Tutor's Free Chat Mode.
 *
 * This component allows users to have an open-ended conversation with the AI.
 * It features dynamic message rendering, API request handling, session tracking,
 * API rate-limiting, and a clean conversational UI.
 */



"use client";
import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import MarkdownRenderer from '../../components/MarkdownRenderer';



// Defines the format of a single message in the chat history
interface Message {
  sender: 'AI' | 'User';
  text: string;
}


/**
 * FreeChat – Top-level component for open-ended AI conversation.
 *
 * Users can send any message without subject restrictions, and the AI
 * will respond based on conversational memory and user prompts.
 */
export default function FreeChat() {
  //User Session hook
  const { data: session } = useSession();

  // Chat state variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);


  /**
   * Checks if the user has API access left for the day.
   * @param userId - Supabase user ID
   * @returns Whether the user is allowed to continue using the API
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
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/free_chat/memory/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session.user.id,
          },
        });

        setMessages([{
          sender: 'AI',
          text: "Welcome to Free Chat with the AI Tutor! Start the conversation however you'd like 😊",
        }]);

        hasInitialized.current = true;
      } catch {
        setMessages([{
          sender: 'AI',
          text: 'Sorry, I could not start the conversation.',
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

    //Add the user's message to the conversation
    setMessages((prev) => [...prev, { sender: 'User', text: userInput }]);
    setUserInput('');
    setLoading(true);


    // Request AI response
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/free_chat`, {
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
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Something went wrong!' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center container mx-auto p-6 2xl:p-10">
      <h2 className="text-4xl 2xl:text-5xl font-semibold mb-6 2xl:mb-10 text-gray-800">🗨️ Free Chat Mode</h2>

      {/* Chat Interface */}
      <div className="w-full max-w-3xl 2xl:max-w-4xl bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 2xl:p-8 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2 2xl:space-y-3" style={{ maxHeight: '60vh' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 2xl:p-4 rounded-xl shadow-sm 2xl:text-lg ${
                msg.sender === 'AI' ? 'bg-indigo-50 text-gray-800' : 'bg-teal-50 text-gray-700'
              }`}
            >
              <div className="flex flex-wrap gap-1 items-start">
                <strong className="shrink-0">{msg.sender}:</strong>
                {msg.sender === 'AI' ? (
                  <div className="flex-1 overflow-x-hidden break-words 2xl:text-lg">
                    <MarkdownRenderer content={msg.text} />
                  </div>
                ) : (
                  <span className="flex-1 2xl:text-lg">{msg.text}</span>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-indigo-600 animate-pulse 2xl:text-lg">AI is typing...</div>}
        </div>

        {/* Text Input */}
        <div className="flex items-center mt-2 2xl:my-auto">
          <textarea
            className="flex-1 border border-gray-300 rounded-xl p-3 2xl:p-4 mr-2 shadow-sm resize-y overflow-y-auto 2xl:text-lg"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your message..."
            rows={1}
            style={{ minHeight: '3.2rem', maxHeight: '10rem' }}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white rounded-xl p-3 2xl:p-4 hover:bg-indigo-600 shadow-md transition duration-200 flex items-center"
          >
            Send <SendHorizonal className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
