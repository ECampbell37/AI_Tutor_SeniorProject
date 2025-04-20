// app/account/page.tsx

'use client';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, UserCircle, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';


export default function AccountPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-md p-10 sm:p-14 rounded-3xl shadow-2xl text-center max-w-md w-full transition-transform duration-300 ease-in-out animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Lock className="ml-1 h-16 w-16" /> You&apos;re not signed in
          </h1>
          <p className="mt-6 text-gray-700 mb-8 text-base sm:text-lg">
          To access your account and enjoy all the features, please log in.
          </p>
          <Link href="/signin" className="inline-block w-full hover:no-underline">
            <button className="w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              Log In
            </button>
          </Link>
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
