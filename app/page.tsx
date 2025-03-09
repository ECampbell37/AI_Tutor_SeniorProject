// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Tutor</h1>
      <p className="mb-8">Your personalized AI-powered tutoring experience.</p>
      <div className="flex justify-center gap-4">
        <Link href="/tutor">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-gray-800">
            Select Your Tutor
          </button>
        </Link>
        <Link href="/chat">
          <button className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-gray-800">
            Start Chatting
          </button>
        </Link>
      </div>
    </div>
  );
}
