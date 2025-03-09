// components/NavBar.tsx
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-blue-100 p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">AI Tutor</Link>
      </div>
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:text-blue-600">Home</Link>
        </li>
        <li>
          <Link href="/tutor" className="hover:text-blue-600">Select Tutor</Link>
        </li>
        <li>
          <Link href="/topics" className="hover:text-blue-600">Topics</Link>
        </li>
        <li>
          <Link href="/chat" className="hover:text-blue-600">Chat</Link>
        </li>
      </ul>
    </nav>
  );
}
