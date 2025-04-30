"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { SendHorizonal, X } from "lucide-react";
import MarkdownRenderer from "../../components/MarkdownRenderer";

interface Message {
  sender: "AI" | "User" | "separator";
  text: string;
}

export default function PDFChat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const hasInitialized = useRef(false);

  // Add welcome message on first load
  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const initializeChat = async () => {
      try {
        setMessages([{
          sender: 'AI',
          text: "📘 Welcome! I’ve loaded your PDF. Ask anything about it, and I’ll do my best to help.",
        }]);
        hasInitialized.current = true;
      } catch (err) {
        setMessages([{
          sender: 'AI',
          text: '❌ Sorry, something went wrong while initializing the PDF chat.',
        }]);
      }
    };

    initializeChat();
  }, [session]);

  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    setMessages((prev) => [...prev, { sender: "User", text: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/pdf/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      console.log("PDF Ask API Response:", data); // Helpful debug line

      if (data?.message && data.message.trim() !== "") {
        setMessages((prev) => [...prev, { sender: "AI", text: data.message }]);
      } else {
        setMessages((prev) => [...prev, { sender: "AI", text: "🤔 Sorry, I couldn't find anything relevant in the document." }]);
      }
    } catch (error) {
      console.error("PDF Ask Error:", error);
      setMessages((prev) => [...prev, { sender: "AI", text: "❌ Oops! Something went wrong connecting to the server." }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center container mx-auto p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <h2 className="text-4xl font-semibold mb-6 text-gray-800">📄 PDF Reader Chat</h2>

      <div className="w-full max-w-4xl bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col flex-grow animate-fadeIn">
        <div className="overflow-y-auto mb-4 flex-1 space-y-2" style={{ maxHeight: '60vh' }}>
          {messages.map((msg, idx) =>
            msg.sender === 'separator' ? (
              <div key={idx} className="text-center text-gray-400 py-2">{msg.text}</div>
            ) : (
              <div
                key={idx}
                className={`p-3 rounded-xl shadow-sm ${
                  msg.sender === 'AI' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-gray-700'
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
          {loading && <div className="text-blue-600 animate-pulse">AI is typing...</div>}
        </div>

        <div className="flex items-center">
          <textarea
            className="flex-1 border border-gray-300 rounded-xl p-3 mr-2 shadow-sm resize-y overflow-y-auto"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Type your question about the PDF..."
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
    </div>
  );
}
