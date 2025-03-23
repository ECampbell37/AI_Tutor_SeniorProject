// components/NavBar.tsx
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BotMessageSquare } from 'lucide-react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Home Button as text */}
        <Link href="/" className="flex items-center text-xl font-bold text-white hover:no-underline">
          <BotMessageSquare size={28} />
          <span className="ml-2">AI Tutor</span>
        </Link>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="hidden md:block"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="md:hidden"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown – appears below the nav bar on mobile */}
      {isMenuOpen && (
        <ul className="md:hidden absolute top-full right-4 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/tutor"
              className="hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Select Tutor
            </Link>
          </li>
          <li>
            <Link
              href="/topics"
              className="hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Topics
            </Link>
          </li>
          <li>
            <Link
              href="/chat"
              className="hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
          </li>
        </ul>
      )}

      {/* Desktop Drawer Menu – slides in from the right on desktop */}
      <div
        className={`hidden md:block fixed top-0 right-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button positioned in the top-right */}
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        {/* Extra top padding to avoid overlapping the close icon */}
        <ul className="pt-16 p-6 space-y-4">
          <li>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/tutor" onClick={() => setIsMenuOpen(false)}>
              Select Tutor
            </Link>
          </li>
          <li>
            <Link href="/topics" onClick={() => setIsMenuOpen(false)}>
              Topics
            </Link>
          </li>
          <li>
            <Link href="/chat" onClick={() => setIsMenuOpen(false)}>
              Chat
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
