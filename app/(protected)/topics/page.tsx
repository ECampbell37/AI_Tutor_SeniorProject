// app/topics/page.tsx

'use client';
import Link from 'next/link';

export default function Topics() {
  const topics = [
    { name: 'English', href: '/chat?subject=English' },
    { name: 'History', href: '/chat?subject=History' },
    { name: 'Mythology', href: '/chat?subject=Mythology' },
    { name: 'Psychology', href: '/chat?subject=Psychology' },
    { name: 'Astronomy', href: '/chat?subject=Astronomy' },
    { name: 'AI/ML', href: '/chat?subject=AI/ML' },
    { name: 'Computer Science', href: '/chat?subject=Computer%20Science' },
    { name: 'Physics', href: '/chat?subject=Physics' },
    { name: 'Biology', href: '/chat?subject=Biology' },
    { name: 'Chemistry', href: '/chat?subject=Chemistry' },
    { name: 'Philosophy', href: '/chat?subject=Philosophy' },
    { name: 'Business', href: '/chat?subject=Business' },
    { name: 'Finance', href: '/chat?subject=Finance' },
    { name: 'Other: ___', href: '/chat?subject=Other' },
  ];

  return (
    <div className="min-h-screen flex flex-col"> 
      <div className="container mx-auto p-4 flex-grow">
        <h2 className="text-center text-3xl font-semibold mb-6">Select a Topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <Link key={topic.name} href={topic.href}>
              <button className="h-32 w-full bg-blue-600 text-white rounded-3xl hover:bg-gray-800 text-lg font-bold">
                {topic.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

