// app/page.tsx
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="text-center bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl animate-fadeIn">
        <div className="inline-block mb-6 animate-bounce-slow">
          <BookOpen className="text-blue-500 w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300">
            AI Tutor
          </span>
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Your personalized AI-powered tutoring experience awaits.
        </p>
        <Link href="/tutor" className='hover:no-underline'>
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-full flex items-center shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600">
            Select Your Tutor
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
