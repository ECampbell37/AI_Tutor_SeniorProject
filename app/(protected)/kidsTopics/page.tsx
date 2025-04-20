// app/kidsTopics/page.tsx

'use client';
import Link from 'next/link';


export default function KidsTopics() {
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
    <div className="min-h-screen flex flex-col"> 
      <div className="container mx-auto p-4 flex-grow">
        <h2 className="text-center text-3xl font-semibold mb-6">Select a Topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kidsTopics.map((topic) => (
            <Link key={topic.name} href={topic.href}>
              <button className="h-32 w-full bg-green-600 text-white rounded-3xl hover:bg-gray-800 text-lg font-bold">
                {topic.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

