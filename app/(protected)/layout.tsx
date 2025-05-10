/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/layout.tsx
 ************************************************************/


/**
 * Protected Layout – Wraps authenticated pages with session and backend checks.
 *
 * - Redirects unauthenticated users to the /account login page
 * - Ensures backend API is awake before rendering child components
 * - Displays animated loading screen until auth + API readiness + delay
 */


'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, BotMessageSquare } from 'lucide-react';


/**
 * Layout wrapper for all pages under `/app/(protected)/`.
 *
 * Enforces user authentication and API readiness before rendering children.
 * Shows a custom animated loading screen while checks are in progress.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // NextAuth session status (authenticated, unauthenticated, loading)
  const { status } = useSession();
  const router = useRouter();

  // State to track readiness
  const [authReady, setAuthReady] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);

  
  // Short delay to prevent UI flickering when loading is too fast
  useEffect(() => {
    const timeout = setTimeout(() => setDelayPassed(true), 1100);
    return () => clearTimeout(timeout);
  }, []);


  // Check authentication, redirect unauthenticated users to login page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/account');
    } else if (status === 'authenticated') {
      setAuthReady(true);
    }
  }, [status, router]);


  // Ping the FastAPI backend to make sure it’s awake
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API}/health`, {
          cache: 'no-store',
        });
        if (res.ok) {
          setApiReady(true);
        } else {
          throw new Error();
        }
      } catch {
        // Retry if server is asleep or slow
        setTimeout(checkApi, 3000);
      }
    };

    if (authReady) {
      checkApi();
    }
  }, [authReady]);


  // Determine whether to show the loading screen
  const showLoadingScreen = !authReady || !apiReady || !delayPassed;


  // Show loading screen with animation if backend is not ready or user is loading
  if (showLoadingScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 animate-pulse-slow px-6">
        <BotMessageSquare className="w-16 h-16 text-blue-500 animate-bounce-slow mb-6" />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight animate-fadeInUp">
          Initializing AI Tutor...
        </h1>
        <p className="text-md text-gray-600 max-w-md">
          {status === 'loading'
            ? 'Checking your session...'
            : 'Waking up the AI engine. This may take a few seconds if the server was asleep.'}
        </p>
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mt-6" />
      </div>
    );
  }

  // Render protected page content once all checks pass
  return <>{children}</>;
}
