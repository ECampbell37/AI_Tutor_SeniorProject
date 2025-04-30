'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { SendHorizonal } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer';

interface Message {
  sender: 'AI' | 'User';
  text: string;
}

export default function ProfessionalChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  async function checkApiAllowance(userId: string): Promise<boolean> {
    const res = await fetch('/api/usage/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    return data.allowed === true;
  }

  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const initializeMemory = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/professional_chat/memory/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session.user.id,
          },
        });

        setMessages([{
          sender: 'AI',
          text: "👋 Welcome to Professional Mode! Ask advanced questions involving math, code, or deep concepts — I'm here to help like a subject matter expert.",
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

  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily API limit. Please come back tomorrow!",
      }]);
      return;
    }

    const userText = userInput;
    setMessages((prev) => [...prev, { sender: 'User', text: userText }]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/professional_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'AI', text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Oops! Something went wrong.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="w-full max-w-4xl flex flex-col flex-grow p-6">
        <h2 className="text-4xl font-semibold mb-6 text-gray-800 text-center">🎓 Professional Tutor</h2>
  
        <div className="flex flex-col bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 flex-grow overflow-hidden">
          {/* Chat messages container */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl shadow-sm ${
                  msg.sender === 'AI' ? 'bg-purple-50 text-purple-800' : 'bg-teal-50 text-gray-700'
                }`}
              >
                <div className="flex flex-wrap gap-1 items-start">
                  <strong className="shrink-0">{msg.sender}:</strong>
                  {msg.sender === 'AI' ? (
                    <div className="flex-1 overflow-x-hidden break-words space-y-2">
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  ) : (
                    <span className="flex-1">{msg.text}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-purple-600 animate-pulse">AI is typing...</div>}
          </div>
  
          {/* Input area */}
          <div className="flex items-center mt-2">
            <textarea
              className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 shadow-sm resize-y overflow-y-auto"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask a professional question..."
              rows={1}
              style={{ minHeight: '3.2rem', maxHeight: '10rem' }}
            />
            <button
              onClick={sendMessage}
              className="bg-purple-500 text-white rounded-xl p-3 hover:bg-purple-600 shadow-md transition duration-200 flex items-center"
            >
              Send <SendHorizonal className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
