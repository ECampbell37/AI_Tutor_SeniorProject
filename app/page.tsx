/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/page.tsx
 ************************************************************/



/**
 * Home Page – Landing screen for AI Tutor.
 *
 * Features:
 * - Hero section with welcome message and main action button
 * - Horizontally scrolling subject image strip
 * - Previews for Free Chat, PDF Mode, and About
 * - Footer with credits and connection status link
 * 
 * This serves as the user's first impression of AI Tutor.
 */


'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle, FileText, BotMessageSquare} from 'lucide-react'


// Array of subject image paths used in the scrolling images section
const subjects = [
  '/subjects/mythology.png',
  '/subjects/astronomy.png',
  '/subjects/philosophy.png',
  '/subjects/science.png',
  '/subjects/history.png',
  '/subjects/AI_ML.png',
  '/subjects/psychology.png',
  '/subjects/nature.png',
  '/subjects/business.png',
]


/**
 * Home – Main landing page component.
 * Includes animations, mode previews, and links to key app areas.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 text-gray-900 overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 py-20 2xl:py-32 2xl:px-8 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 animate-fadeInUp">
        <div className="max-w-3xl 2xl:max-w-4xl bg-white bg-opacity-90 p-10 2xl:p-14 rounded-2xl shadow-xl">
          
          {/* Bouncing Bot Icon */}
          <div className="inline-block mb-6 animate-bounce-slow">
            <BotMessageSquare className="text-blue-500 w-20 h-20 2xl:w-24 2xl:h-24" />
          </div>

          {/* Welcome Header */}
          <h1 className="text-5xl md:text-6xl 2xl:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300">
              AI Tutor
            </span>
          </h1>
          <p className="text-lg 2xl:text-2xl text-gray-700 mb-8">
            Your personalized AI-powered learning assistant for every subject.
          </p>

          {/* Tutor Selection Button */}
          <Link href="/tutor" className="hover:no-underline">
            <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-8 2xl:py-4 2xl:px-10 text-lg 2xl:text-2xl rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
              Select Your Tutor
              <ArrowRight className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>
          </Link>
        </div>
      </section>


      {/* SCROLLING SUBJECT IMAGES */}
      <section className="py-10 2xl:py-16 bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 border-y border-gray-200 animate-fadeInUp">
        <div className="max-w-screen-2xl mx-auto 2xl:rounded-xl overflow-hidden">
          <div className="scrolling-images flex space-x-4 px-4 2xl:space-x-6 2xl:px-8">
            {[...subjects, ...subjects].map((src, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={src}
                  alt={`Subject ${idx}`}
                  width={160}
                  height={160}
                  className="rounded-xl shadow-md object-cover w-40 h-40 2xl:w-48 2xl:h-48"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODES SECTION */}
      <main className="max-w-5xl 2xl:max-w-7xl mx-auto px-6 2xl:px-10 py-16 2xl:py-24 space-y-16 2xl:space-y-24">

        {/* Free Chat */}
        <section className="bg-blue-50 rounded-2xl py-16 px-6 2xl:py-20 2xl:px-10 shadow-md text-center animate-fadeInUp">
          <h2 className="text-3xl 2xl:text-4xl font-bold text-gray-800 mb-4">💬 Free Chat</h2>
          <p className="text-gray-600 mb-8 2xl:text-lg">
            Ask anything — whether it’s homework help, brainstorming, or just a curious question. Chat freely with the AI!
          </p>
          <Link href="/freeChat" className='hover:no-underline'>
            <button className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 text-white 2xl:text-lg font-semibold py-3 px-8 2xl:py-4 2xl:px-10 rounded-full flex items-center justify-center mx-auto shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
              Try Free Chat
              <MessageCircle className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>
          </Link>
        </section>

        {/* PDF Mode */}
        <section className="bg-blue-50 rounded-2xl py-16 px-6 2xl:py-20 2xl:px-10 shadow-md text-center animate-fadeInUp">
          <h2 className="text-3xl 2xl:text-4xl font-bold text-gray-800 mb-4">📄 PDF Mode (Experimental)</h2>
          <p className="text-gray-600 mb-8 2xl:text-lg">
            Upload a textbook or handout and ask questions directly about it — ideal for learning with your own materials.
          </p>
          <Link href="/pdfUpload" className='hover:no-underline'>
            <button className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 text-white 2xl:text-lg font-semibold py-3 px-8 2xl:py-4 2xl:px-10 rounded-full flex items-center justify-center mx-auto shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
              Preview PDF Mode
              <FileText className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>
          </Link>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-blue-50 bg-opacity-90 rounded-2xl py-16 px-6 2xl:py-20 2xl:px-10 animate-fadeInUp border-t border-gray-100">
          <div className="max-w-4xl 2xl:max-w-5xl mx-auto text-center">
            <h2 className="text-3xl 2xl:text-4xl font-extrabold text-gray-900 mb-4">🤖 About This Project</h2>
            <p className="text-lg 2xl:text-xl text-gray-700 mb-8">
              Learn how AI Tutor was built and what makes it special. Discover the technologies, purpose, and people behind the scenes.
            </p>
            <Link href="/about" className="hover:no-underline">
              <button className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white 2xl:text-lg font-semibold py-3 px-8 2xl:py-4 2xl:px-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 mx-auto">
                Visit About Page
                <ArrowRight className="ml-2 h-5 w-5 2xl:h-6 2xl:w-6" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-blue-100 py-6 2xl:py-10 text-center text-sm 2xl:text-base text-gray-600">
        <div className="space-y-2">
          <p>&copy; {new Date().getFullYear()} AI Tutor. Built by Elijah Campbell-Ihim</p>
          <p className="flex flex-col sm:flex-row justify-center items-center gap-1">
            Experiencing interruptions?
            <a 
              href="/statusCheck"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
            >
              Check the Connection
            </a>
          </p>
        </div>
      </footer>


      {/* SCROLLING ANIMATION STYLES */}
      <style jsx>{`
        .scrolling-images {
          width: max-content;
          animation: scroll 50s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
