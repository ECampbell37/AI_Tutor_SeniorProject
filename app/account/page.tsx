// app/account/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, UserCircle, Sparkles } from 'lucide-react';

export default function AccountPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-center px-6">
        <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">You're not signed in</h1>
          <p className="text-gray-600">Please log in to access your account.</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl text-center animate-fadeIn">
        <div className="inline-block mb-6 animate-bounce-slow">
          <UserCircle className="text-blue-500 w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Account</h1>
        <p className="text-gray-600 mb-6">Welcome back, {user?.name || 'Learner'}!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
          <div className="bg-white bg-opacity-70 border border-blue-200 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">📧 Email</h2>
            <p className="text-sm text-gray-700">{user?.email || 'Not provided'}</p>
          </div>
          <div className="bg-white bg-opacity-70 border border-purple-200 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-purple-600 mb-2">🎓 Role</h2>
            <p className="text-sm text-gray-700">Student</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-2 text-pink-600">
            <Sparkles size={18} />
            <span className="text-md font-semibold">Coming Soon</span>
          </div>
          <p className="text-sm text-gray-600">
            Track your quiz scores, unlock badges, and view personalized stats — all from your dashboard.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center mx-auto shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 hover:brightness-110"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
