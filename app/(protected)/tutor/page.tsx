/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/tutor/page.tsx
 ************************************************************/



/**
 * TutorSelection Page – Displays all available tutor modes.
 *
 * This page serves as the main mode selector for AI Tutor.
 * Users can swipe or click to select between:
 * - Kids Mode (green): simplified, fun lessons
 * - Casual Mode (blue): general topic-based learning
 * - Professional Mode (purple): advanced technical tutoring
 */

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';


/**
 * Renders a divided interface (horizontally scrollable on small screens) 
 * for selecting a tutor mode. Each section is color-coded and includes 
 * hover text to describe the mode.
 */
export default function TutorSelection() {

  // Show hint on mobile for first 5 seconds
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {/* Mobile-only swipe hint */}
      {showHint && (
        <div className="md:hidden fixed top-20 w-full z-50 flex justify-center pointer-events-none text-center">
          <div
            onClick={() => setShowHint(false)}
            className="bg-white bg-opacity-90 text-gray-800 text-sm px-4 py-2 rounded-full shadow-lg transition-all duration-700 ease-out animate-fadeIn cursor-pointer pointer-events-auto"
          >
            👉 Swipe left or right to choose a tutor
          </div>
        </div>
      )}


    <div className="h-screen flex overflow-x-auto snap-x snap-mandatory bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 animate-fade">
      {/* Kids Mode */}
      <Link 
        href="/kidsTopics" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-green-300 via-green-400 to-cyan-500 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-green-400 group-hover:to-cyan-500">
          Kids
          <span className="mt-4 text-base px-4 text-center transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
            Fun and interactive lessons made just for kids!
          </span>
        </div>
      </Link>
      {/* Casual Mode */}
      <Link 
        href="/topics" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-cyan-500 group-hover:to-blue-700">
          Casual
          <span className="mt-4 text-base px-4 text-center transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
            Relaxed, friendly tutor in any subject you can think of!
          </span>
        </div>
      </Link>
      {/* Professional Mode */}
      <Link 
        href="/professionalChat" 
        className="flex-none w-screen md:w-auto md:flex-1 snap-center group relative overflow-hidden hover:no-underline"
      >
        <div className="h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex flex-col items-center justify-center text-white text-4xl font-bold transition duration-300 group-hover:from-indigo-600 group-hover:to-purple-600">
          Professional
          <span className="mt-4 text-base px-4 text-center transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
            Advanced guidance for college, careers, and coding!
          </span>
        </div>
      </Link>
    </div>
    </>
  );
}

