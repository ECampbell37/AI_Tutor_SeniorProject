/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/about/page.tsx
 ************************************************************/




/**
 * About Page – Informational landing page for AI Tutor.
 *
 * This page introduces the purpose and features of the AI Tutor web app.
 * It describes the learning modes, backend tech stack, and the mission
 * behind the project. Animated sections and clean layout help convey 
 * professionalism and clarity for first-time users.
 */


'use client';

import Link from 'next/link';
import { BotMessageSquare, Undo2 } from 'lucide-react';


/**
 * Renders the About page with an animated walkthrough of AI Tutor's goals,
 * features, available tutor modes, and technical stack.
 */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-cyan-200 text-gray-900 overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-6 py-20 animate-fadeInUp">
        <div className="max-w-3xl bg-white bg-opacity-90 p-12 rounded-2xl shadow-xl">
          <div className="inline-block mb-6 animate-bounce-slow">
            <BotMessageSquare className="text-blue-500 w-20 h-20" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Meet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300">
              AI Tutor
            </span>
          </h1>
          <p className="text-lg text-gray-700">
            A personalized way to learn — blending conversation, quizzes, and progress tracking into one AI-powered experience.
          </p>
        </div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="bg-blue-50 bg-opacity-90 py-16 px-6 border-t border-gray-200 animate-fadeInUp">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">📚 Overview</h2>
          <p className="text-gray-700 text-base">
            AI Tutor is a web-based educational resource that adapts to your needs. Whether you&apos;re studying for an exam or exploring a new topic, it guides you through interactive lessons and quizzes powered by AI. It&apos;s built for clarity, simplicity, and constant exploration.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-blue-50 py-16 px-6 border-t border-gray-100 animate-fadeInUp">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">✨ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white bg-opacity-80 border border-blue-200 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">🎯 Personalized Lessons</h3>
              <p className="text-sm text-gray-700">
                Get guided help on your chosen topic through a dynamic, conversational tutor experience.
              </p>
            </div>
            <div className="bg-white bg-opacity-80 border border-purple-200 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-purple-600">📝 Smart Quizzing</h3>
              <p className="text-sm text-gray-700">
                Take AI-generated quizzes based on your learning session. Questions update as your understanding grows.
              </p>
            </div>
            <div className="bg-white bg-opacity-80 border border-pink-200 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-pink-600">📈 Progress & Mastery</h3>
              <p className="text-sm text-gray-700">
                Track your growth with visual feedback, unlock achievements, and stay motivated as you advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TUTOR MODES SECTION */}
      <section className="bg-white bg-opacity-90 py-16 px-6 border-t border-gray-200 animate-fadeInUp">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🍎 Meet the Tutors</h2>
          <p className="text-gray-700 text-base mb-8">
            Choose the right AI mode for your learning needs. Each tutor offers a distinct experience tailored to different ages, goals, and contexts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">

            <div className="bg-green-100 bg-opacity-50 border border-green-300 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-2">🧒 Kids Mode</h3>
              <p className="text-sm text-gray-700">
                Designed for younger learners with simplified explanations, playful language, and lots of encouragement. Lessons are fun and easy to follow.
              </p>
            </div>

            <div className="bg-blue-100 bg-opacity-50 border border-blue-300 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">💬 Casual Mode</h3>
              <p className="text-sm text-gray-700">
                Think of this as your own personal teacher of any subject you can think of! A casual and friendly learning environment that enables learners to explore and master their own personal interests.
              </p>
            </div>

            <div className="bg-purple-100 bg-opacity-50 border border-purple-300 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">🧑‍💼 Professional Mode</h3>
              <p className="text-sm text-gray-700">
                Geared toward college students and adults who are looking for more technicality. Includes markdown, math equation, and code functionality — perfect for technical or academic topics.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

            <div className="bg-cyan-100 bg-opacity-50 border border-cyan-300 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-cyan-700 mb-2">🗨️ Free Chat</h3>
              <p className="text-sm text-gray-700">
                Have an open-ended conversation with the AI. Great for brainstorming, Q&amp;A, or just thinking out loud with a smart companion.
              </p>
            </div>

            <div className="bg-yellow-100 bg-opacity-50 border border-yellow-300 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2">📄 PDF Tutor (Experimental)</h3>
              <p className="text-sm text-gray-700">
                Upload a PDF and ask questions about the content. Ideal for summarizing text and extracting out useful information. This mode is a new and experimental feature.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white bg-opacity-90 py-16 px-6 border-t border-gray-200 animate-fadeInUp">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">⚙️ How It Works</h2>
          <p className="text-gray-700 text-base mb-4">
            AI Tutor is built using <strong>Next.js</strong> for the frontend, <strong>LangChain</strong> for structured prompts, <strong>OpenAI</strong> models for conversation and evaluation, and <strong>Supabase</strong> for secure auth and data tracking.
          </p>
          <p className="text-gray-700 text-base">
            A FastAPI Python backend manages prompt routing, memory, and quiz scoring. Every feature is designed to provide fast, reliable, and intuitive feedback to the learner.
          </p>
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section className="bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 py-20 px-6 border-t border-gray-100 animate-fadeInUp">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🎓 Our Mission</h2>
          <p className="text-gray-700 text-lg">
            AI Tutor was created to make education more accessible, engaging, and personalized. We believe learning
            should feel like a conversation — not a chore. By combining powerful AI with intuitive design, we aim to
            empower people of all ages to expand thier minds and enjoy the learning process. It&apos;s time to reimagine 
            what education can be ✨ 
          </p>
        </div>
      </section>

      {/* FOOTER / CREDIT */}
      <section className="bg-white bg-opacity-90 py-10 px-6 border-t border-gray-200 animate-fadeInUp">
        <div className="flex flex-col items-center space-y-6 text-center">
          <p className="text-sm text-gray-600 max-w-xl">
            Built with 💡 by{' '}
            <a
              href="https://www.elijahcampbellihimportfolio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Elijah Campbell-Ihim
            </a>{' '}
            using Next.js, LangChain, FastAPI, and Supabase.
          </p>
          {/* Back to Home Button */}
          <Link href="/" className="hover:no-underline">
            <button className="bg-transparent text-rose-500 hover:bg-gradient-to-r hover:from-rose-400 hover:via-pink-500 hover:to-rose-500 hover:text-white font-semibold py-3 px-8 rounded-full flex items-center hover:scale-105 transition-all duration-300">
              <Undo2 className="mr-2 h-5 w-5" />
              Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
