/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/signin/page.tsx
 ************************************************************/



/**
 * Sign-In Page – Allows existing users to log into their account.
 *
 * Uses NextAuth's `signIn()` method with custom credentials.
 * Redirects to the `/account` page on success, or shows an error on failure.
 */


'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



/**
 * Renders a styled sign-in form for username/password authentication.
 * Communicates with the NextAuth credentials provider backend.
 */
export default function SignInPage() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();


  /**
   * Handles sign-in form submission.
   * Calls NextAuth's `signIn()` and redirects on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Initiates Sign in
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    //If error, show message, otherwise, go to home screen
    if (res?.error) {
      setErrorMsg('Invalid credentials');
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4 2xl:px-10">
      <div className="relative bg-white shadow-xl rounded-2xl p-8 2xl:p-10 w-full max-w-md 2xl:max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        {/* Header Area */}
        <h2 className="text-3xl 2xl:text-4xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h2>

        {errorMsg && (
          <p className="text-red-600 text-sm 2xl:text-base text-center mb-4 bg-red-100 rounded p-2">{errorMsg}</p>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 2xl:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 2xl:text-lg"
              placeholder="Enter your username"
            />
          </div>
          {/* Password Input */}
          <div>
            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 2xl:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 2xl:text-lg"
              placeholder="••••••••"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 2xl:py-3 rounded-lg transition duration-200 2xl:text-lg"
          >
            Sign In
          </button>
        </form>
        {/* Link to Sign Up */}
        <p className="mt-6 text-sm 2xl:text-base text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-500 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
