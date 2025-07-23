/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/kidsTopics/page.tsx
 ************************************************************/




/**
 * KidsTopics Page – Subject selector for Kids Mode in AI Tutor.
 *
 * Displays a grid of kid-friendly topics such as dinosaurs, superheroes,
 * and nature. Clicking a topic routes to the Kids Chat interface for that subject.
 */


'use client';
import Link from 'next/link';



/**
 * Renders a grid of predefined subjects tailored for children.
 * Each button links to the corresponding `/kidsChat` route with a subject query.
 */
export default function KidsTopics() {

  // List of predefined kids learning subjects with their corresponding chat links
  const kidsTopics = [
    { name: 'Science', href: '/kidsChat?subject=Science' },
    { name: 'Nature', href: '/kidsChat?subject=Nature' },
    { name: 'Space', href: '/kidsChat?subject=Space' },
    { name: 'Geography', href: '/kidsChat?subject=Geography' },
    { name: 'Computers', href: '/kidsChat?subject=Computers' },
    { name: 'Landmarks', href: '/kidsChat?subject=Landmarks' },
    { name: 'Ancient History', href: '/kidsChat?subject=Ancient_History' },
    { name: 'Superheros', href: '/kidsChat?subject=Superheros' },
    { name: 'Disney Princesses', href: '/kidsChat?subject=Disney_Princesses' },
    { name: 'Dinosaurs', href: '/kidsChat?subject=Dinosaurs' },
  ];

  return (
    <div className="min-h-screen flex flex-col animate-fadeIn"> 
      <div className="container mx-auto p-4 2xl:p-6 flex-grow">
        <h2 className="text-center text-3xl 2xl:text-4xl font-semibold mb-6 2xl:mb-10">
          Select a Topic
        </h2>

        {/* Topic Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {kidsTopics.map((topic) => (
            <Link key={topic.name} href={topic.href}>
              <button className="h-32 2xl:h-36 w-full bg-green-600 text-white rounded-3xl hover:bg-gray-800 text-lg 2xl:text-xl font-bold">
                {topic.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

