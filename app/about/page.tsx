// app/about/page.tsx
'use client';

import Link from 'next/link';
import { BotMessageSquare, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="text-center bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl animate-fadeIn max-w-3xl w-full">
        <div className="inline-block mb-6 animate-bounce-slow">
          <BotMessageSquare className="text-blue-500 w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          About{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300">
            AI Tutor
          </span>
        </h1>
        <p className="mb-6 text-lg text-gray-700">
          AI Tutor is your intelligent learning companion — helping you explore subjects, test your knowledge,
          and grow your skills through personalized, AI-powered lessons and quizzes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left my-10">
          <div className="bg-white bg-opacity-70 border border-blue-200 p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">🎯 Personalized Lessons</h2>
            <p className="text-sm text-gray-700">
              Start conversations with an AI tutor specialized in your selected topic.
            </p>
          </div>
          <div className="bg-white bg-opacity-70 border border-purple-200 p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-purple-600">📝 Smart Quizzing</h2>
            <p className="text-sm text-gray-700">
              Test your knowledge with AI-generated quizzes tailored to your progress.
            </p>
          </div>
          <div className="bg-white bg-opacity-70 border border-pink-200 p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">📈 Progress & Mastery</h2>
            <p className="text-sm text-gray-700">
              Unlock badges and level up as you demonstrate understanding.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-10">
          Created with 💡 by Elijah Campbell-Ihim using Next.js, LangChain, and the OpenAI API.
        </p>

        <Link href="/" className="hover:no-underline">
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-full flex items-center shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
