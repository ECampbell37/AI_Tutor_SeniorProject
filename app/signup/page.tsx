/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/signup/page.tsx
 ************************************************************/



/**
 * SignUp Page – Allows users to create a new account.
 *
 * Handles input validation, displays success/error messages,
 * and redirects to the sign-in page after successful registration.
 */


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



/**
 * Renders the user registration form with client-side validation.
 * On submit, sends a POST request to `/api/auth/signup` to create a new user.
 */
export default function SignUpPage() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  
  /**
   * Handles the form submission by sending a signup request to the backend.
   * Displays appropriate feedback and redirects on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Initiate Sign up
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    //Recieve Status
    const data = await res.json();

    //If error, show error, if successful, redirect to signin
    if (data.error) {
      setErrorMsg(data.error);
      setSuccessMsg('');
    } else {
      setSuccessMsg('🎉 Account created! Redirecting to sign in...');
      setErrorMsg('');
      setUsername('');
      setPassword('');
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 px-4 2xl:px-10">
      <div className="relative bg-white shadow-xl rounded-2xl p-8 2xl:p-10 w-full max-w-md 2xl:max-w-lg transform transition duration-300 hover:scale-[1.01]">
        {/* Header Section */}
        <h2 className="text-3xl 2xl:text-4xl font-bold text-center text-gray-800 mb-6">Create an Account 🚀</h2>

        {/* Error/Success Messages */}
        {errorMsg && (
          <p className="text-red-600 text-sm 2xl:text-base text-center mb-4 bg-red-100 rounded p-2">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm 2xl:text-base text-center mb-4 bg-green-100 rounded p-2">
            {successMsg}
          </p>
        )}

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 2xl:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 2xl:text-lg"
              placeholder="Choose a username"
            />
          </div>
          {/* Password Input */}
          <div>
            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 2xl:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 2xl:text-lg"
              placeholder="Create a password"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 2xl:py-3 rounded-lg transition duration-200 2xl:text-lg"
          >
            Sign Up
          </button>
        </form>
        {/* Link to Sign In */}
        <p className="mt-6 text-sm 2xl:text-base text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-purple-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
