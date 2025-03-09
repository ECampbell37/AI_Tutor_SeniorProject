// app/tutor/page.tsx
import Link from 'next/link';

export default function TutorSelection() {
  return (
    <div className="h-screen flex">
      <Link href="/topics" className="flex-1">
        <div className="h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold hover:bg-gray-800">
          Kids
        </div>
      </Link>
      <Link href="/topics" className="flex-1">
        <div className="h-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold hover:bg-gray-800">
          Casual
        </div>
      </Link>
      <Link href="/topics" className="flex-1">
        <div className="h-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold hover:bg-gray-800">
          Professional
        </div>
      </Link>
    </div>
  );
}
