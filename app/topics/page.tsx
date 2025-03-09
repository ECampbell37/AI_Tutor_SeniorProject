// app/topics/page.tsx
import Link from 'next/link';

export default function Topics() {
  const topics = [
    { name: 'English', href: '/chat' },
    { name: 'History', href: '/chat' },
    { name: 'Mythology', href: '/chat' },
    { name: 'Psychology', href: '/chat' },
    { name: 'Astronomy', href: '/chat' },
    { name: 'AI/ML', href: '/chat' },
    { name: 'Computer Science', href: '/chat' },
    { name: 'Physics', href: '/chat' },
    { name: 'Biology', href: '/chat' },
    { name: 'Chemistry', href: '/chat' },
    { name: 'Philosophy', href: '/chat' },
    { name: 'Business', href: '/chat' },
    { name: 'Finance', href: '/chat' },
    { name: 'Other: ___', href: '/chat' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-center text-3xl font-semibold mb-6">Select a Topic</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <Link key={topic.name} href={topic.href}>
            <button className="h-32 w-full bg-purple-600 text-white rounded hover:bg-gray-800 text-lg font-bold">
              {topic.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
