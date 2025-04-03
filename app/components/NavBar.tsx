// components/NavBar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BotMessageSquare, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function NavBar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Account', href: '/account' },
    { label: 'Home', href: '/' },
    { label: 'Select Tutor', href: '/tutor' },
    { label: 'Topics', href: '/topics' },
    { label: 'Chat', href: '/chat' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
        <Link
          href="/"
          className="flex items-center text-xl font-bold text-white hover:no-underline"
        >
          <BotMessageSquare size={28} />
          <span className="ml-2">AI Tutor</span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label="Open menu"
        >
          <Menu size={32} />
        </button>
      </nav>

      {/* Side-Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 text-white transform transition-transform duration-300 z-40 rounded-l-2xl shadow-lg ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="focus:outline-none hover:text-gray-300 transition"
                aria-label="Close menu"
              >
                <X size={32} />
              </button>
            </div>

            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-gray-700 text-white hover:text-white hover:no-underline hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer section */}
          <div className="pt-6 border-t border-gray-700">
            {session ? (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-lg">Welcome, {session.user?.name}</p>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg hover:brightness-110 transition-all"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 rounded-lg text-black hover:no-underline hover:brightness-110 transition"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
        ></div>
      )}
    </header>
  );
}
