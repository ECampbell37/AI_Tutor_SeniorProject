"use client";
import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
  sender: 'AI' | 'User';
  text: string;
}

export default function FreeChat() {
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

    setMessages((prev) => [...prev, { sender: 'User', text: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/free_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'AI', text: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'AI', text: 'Something went wrong!' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center container mx-auto p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <h2 className="text-4xl font-semibold mb-6 text-gray-800">🗨️ Free Chat Mode</h2>

      <div className="w-full max-w-3xl bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2" style={{ maxHeight: '60vh' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl shadow-sm ${
                msg.sender === 'AI' ? 'bg-indigo-50 text-gray-800' : 'bg-teal-50 text-gray-700'
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          {loading && <div className="text-indigo-600 animate-pulse">AI is typing...</div>}
        </div>

        <div className="flex items-center mt-2">
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
            className="bg-indigo-500 text-white rounded-xl p-3 hover:bg-indigo-600 shadow-md transition duration-200 flex items-center"
          >
            Send <SendHorizonal className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
