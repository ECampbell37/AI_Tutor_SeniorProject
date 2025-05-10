/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/topics/page.tsx
 ************************************************************/



/**
 * Topics Page – Lets users choose a subject for casual tutoring.
 *
 * This page displays a grid of preset subjects and allows users to enter a
 * custom topic. Clicking a topic links to the main `/chat` route with the
 * subject passed as a query parameter.
 */


'use client';
import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';


/**
 * Renders a topic selection screen for casual tutoring mode.
 * Includes preset subjects and a modal for entering custom topics.
 */
export default function Topics() {
  // State hooks for managing user input and modal visibility
  const [customTopic, setCustomTopic] = useState('');
  const [showModal, setShowModal] = useState(false);

  // List of predefined casual learning subjects with their corresponding chat links
  const topics = [
    { name: 'English', href: '/chat?subject=English' },
    { name: 'History', href: '/chat?subject=History' },
    { name: 'Mythology', href: '/chat?subject=Mythology' },
    { name: 'Psychology', href: '/chat?subject=Psychology' },
    { name: 'Astronomy', href: '/chat?subject=Astronomy' },
    { name: 'AI/ML', href: '/chat?subject=AI/ML' },
    { name: 'Computer Science', href: '/chat?subject=Computer%20Science' },
    { name: 'Data Science', href: '/chat?subject=Data%20Science' },
    { name: 'Physics', href: '/chat?subject=Physics' },
    { name: 'Biology', href: '/chat?subject=Biology' },
    { name: 'Chemistry', href: '/chat?subject=Chemistry' },
    { name: 'Philosophy', href: '/chat?subject=Philosophy' },
    { name: 'Business', href: '/chat?subject=Business' },
    { name: 'Finance', href: '/chat?subject=Finance' },
  ];

  return (
    <div className="min-h-screen flex flex-col animate-fadeIn">
      <div className="container mx-auto p-4 flex-grow">
        <h2 className="text-center text-3xl font-semibold mb-6">Select a Topic</h2>

        {/* Topic Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <Link key={topic.name} href={topic.href}>
              <button className="h-32 w-full bg-blue-500 text-white rounded-3xl hover:bg-gray-800 text-lg font-bold">
                {topic.name}
              </button>
            </Link>
          ))}

          {/* Special "Other" Topic Button */}
          <button
            onClick={() => setShowModal(true)}
            className="h-32 w-full bg-blue-500 text-white rounded-3xl hover:bg-gray-800 text-lg font-bold"
          >
            ⭐ Other: ___
          </button>
        </div>
      </div>

      {/* Custom Topic Pop Up */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md animate-fadeIn flex flex-col items-center">
            <button
              onClick={() => setShowModal(false)}
              className="self-end text-gray-400 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-semibold mb-4">Enter Your Own Topic</h3>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-lg text-lg w-full mb-4"
              placeholder="e.g. Environmental Ethics"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />

            {customTopic.trim() && (
              <Link
                href={`/chat?subject=${encodeURIComponent(customTopic)}`}
                className="w-full"
                onClick={() => setShowModal(false)}
              >
                <button className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg">
                  Start
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
