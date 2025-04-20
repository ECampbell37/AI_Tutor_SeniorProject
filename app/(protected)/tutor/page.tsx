// app/tutor/page.tsx

'use client';
import Link from 'next/link';

export default function TutorSelection() {
  return (
    <div className="h-screen flex overflow-x-auto snap-x snap-mandatory bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Link 
        href="/kidsTopics" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-green-300 via-green-400 to-cyan-500 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-green-400 group-hover:to-cyan-500">
          Kids
          <span className="mt-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
            Fun and interactive lessons crafted for young minds!
          </span>
        </div>
      </Link>
      <Link 
        href="/topics" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-cyan-500 group-hover:to-blue-700">
          Casual
          <span className="mt-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
            Relaxed, friendly learning for everyday topics!
          </span>
        </div>
      </Link>
      <Link 
        href="/topics" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-indigo-600 group-hover:to-purple-600">
          Professional
          <span className="mt-4 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
            Advanced tutoring tailored for professional success!
          </span>
        </div>
      </Link>
    </div>
  );
}

