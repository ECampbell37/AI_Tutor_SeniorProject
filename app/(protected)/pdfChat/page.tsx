/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/pdfChat/page.tsx
 ************************************************************/



/**
 * PDF Chat Page – Conversation interface for uploaded PDF documents.
 *
 * After uploading a file via /pdfUpload, users land on this page to
 * ask questions about their PDF. It interacts with a FastAPI backend
 * that uses LangChain to search and answer questions from document content.
 */


"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { SendHorizonal} from "lucide-react";
import MarkdownRenderer from "../../components/MarkdownRenderer";


// Defines the format of a single message in the chat history
interface Message {
  sender: "AI" | "User" | "separator";
  text: string;
}


/**
 * Renders the chat interface that lets users query the uploaded PDF.
 * Displays messages, handles input, and fetches responses from the backend.
 */
export default function PDFChat() {
  //Session
  const { data: session } = useSession();

  // Chat state
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
      body: JSON.stringify({ userId, route: "/pdf/ask" }), // you can customize route logic here
    });

    const data = await res.json();
    return data.allowed === true;
  }



  // On first load, display welcome message if user is authenticated
  useEffect(() => {
    if (!session?.user?.id || hasInitialized.current) return;

    const initializeChat = async () => {
      try {
        setMessages([{
          sender: 'AI',
          text: "📘 Welcome! I’ve loaded your PDF. Ask anything about it, and I’ll do my best to help.",
        }]);
        hasInitialized.current = true;
      } catch {
        setMessages([{
          sender: 'AI',
          text: '❌ Sorry, something went wrong while initializing the PDF chat.',
        }]);
      }
    };

    initializeChat();
  }, [session]);



  /**
   * Sends user's message to the backend and appends the AI response to the chat.
   */
  const sendMessage = async () => {
    if (!userInput.trim() || !session?.user?.id) return;

    // Check API Limit
    const allowed = await checkApiAllowance(session.user.id);
    if (!allowed) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: "🚫 You've reached your daily limit for PDF questions. Try again tomorrow!",
      }]);
      return;
    }

    //Add user message to chat
    setMessages((prev) => [...prev, { sender: "User", text: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      //Generate AI Response
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/pdf/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ message: userInput }),
      });

      //Recieve AI Response from API
      const data = await res.json();

      //If the message exists, display it
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
    <div className="min-h-screen flex flex-col items-center container mx-auto p-6 2xl:p-10">
      <h2 className="text-4xl 2xl:text-5xl font-semibold mb-6 2xl:mb-10 text-gray-800">
        📄 PDF Reader Chat
      </h2>

      {/* Chat Interface */}
      <div className="w-full max-w-4xl 2xl:max-w-5xl bg-white bg-opacity-95 border border-gray-200 rounded-2xl shadow-xl p-6 2xl:p-8 flex flex-col flex-grow animate-fadeIn">
        <div
          className="overflow-y-auto mb-4 flex-1 space-y-2 2xl:space-y-3"
          style={{ maxHeight: '60vh' }}
        >
          {messages.map((msg, idx) =>
            msg.sender === 'separator' ? (
              <div key={idx} className="text-center text-gray-400 py-2 2xl:text-xl">
                {msg.text}
              </div>
            ) : (
              <div
                key={idx}
                className={`p-3 2xl:p-4 rounded-xl shadow-sm 2xl:text-lg ${
                  msg.sender === 'AI'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-teal-50 text-gray-700'
                }`}
              >
                <div className="flex flex-wrap gap-1 items-start">
                  <strong className="shrink-0">{msg.sender}:</strong>
                  {msg.sender === 'AI' ? (
                    <div className="flex-1 overflow-x-hidden 2xl:text-xl">
                      <MarkdownRenderer content={msg.text} />
                    </div>
                  ) : (
                    <span className="flex-1 2xl:text-xl">{msg.text}</span>
                  )}
                </div>
              </div>
            )
          )}
          {loading && (
            <div className="text-blue-600 animate-pulse 2xl:text-lg">AI is typing...</div>
          )}
        </div>

        {/* Text Input */}
        <div className="flex items-center 2xl:my-auto">
          <textarea
            className="flex-1 border border-gray-300 rounded-xl p-3 2xl:p-4 mr-2 shadow-sm resize-y overflow-y-auto 2xl:text-lg"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())
            }
            placeholder="Type your question about the PDF..."
            rows={1}
            style={{ minHeight: '3.2rem', maxHeight: '10rem' }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white rounded-xl p-3 2xl:p-4 hover:bg-blue-600 shadow-md transition duration-200 flex items-center"
          >
            Send <SendHorizonal className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
