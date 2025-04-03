// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 px-4">
      <div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transform transition duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account 🚀</h2>
        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-100 rounded p-2">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm text-center mb-4 bg-green-100 rounded p-2">
            {successMsg}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-purple-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
