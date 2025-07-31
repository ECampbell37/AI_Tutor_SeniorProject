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


// Tips to be displayed in long loading sessions
const loadingTips = [
  "⏳ \"The good life is a process, not a state of being. It is a direction, not a destination.\" – Bruce Lee",
  "🎯 Tip: Be specific in your questions. The more context you give AI, the better your results!",
  "🔍 \"He who has a why can bear almost any how.\" – Friedrich Nietzsche",
  "📌 Confused? Try asking the AI Tutor \"Can you explain that using simple language?\". Works every time!",
  "🚀 Professional Mode is great for coding help, interview prep, or deep technical questions.",
  "💡 \"Knowledge speaks, but wisdom listens.\" – Jimi Hendrix",
  "💡 Fun Fact: The \"GPT\" in ChatGPT stands for \"Generative Pretrained Transformer\". Fancy, huh?",
  "🧠 \"Until you make the unconscious conscious, it will direct your life and you will call it fate.\" – Carl Jung",
  "🌍 Fun Fact: Carl Jung’s ideas on archetypes still influence AI design and storytelling models today.",
  "🔁 \"I do not fear the man who has practiced 1000 kicks. I fear the man who has practiced one kick 1000 times.\" - Bruce Lee",
  "🧭 Fun Fact: The human brain has more synapses than stars in the Milky Way — and you’re using them right now.",
  "🧘‍♂️ \"Trying to define yourself is like trying to bite your own teeth.\" – Alan Watts",
  "💬 Tip: Ask the AI Tutor to simplify a concept, or explain it using real-life examples.",
];



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
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isTipVisible, setIsTipVisible] = useState(true);


  
  // Short delay to prevent UI flickering when loading is too fast
  useEffect(() => {
    const timeout = setTimeout(() => setDelayPassed(true), 1100);
    return () => clearTimeout(timeout);
  }, []);


  // Delay before showing the loading progress bar
  useEffect(() => {
  const timer = setTimeout(() => setShowProgressBar(true), 3000);
  return () => clearTimeout(timer);
}, []);


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

    // Ping
    checkApi();

  }, []);



  // Check authentication, redirect unauthenticated users to login page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/account');
    } else if (status === 'authenticated') {
      setAuthReady(true);
    }
  }, [status, router]);


  // Display Tips
  useEffect(() => {
    if (!showProgressBar) return;

    const interval = setInterval(() => {
      setIsTipVisible(false); // Trigger fade-out

      setTimeout(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % loadingTips.length);
        setIsTipVisible(true); // Trigger fade-in
      }, 750); // Delay matches exit fade duration
    }, 7000);

    return () => clearInterval(interval);
}, [showProgressBar]);





  // Determine whether to show the loading screen
  const showLoadingScreen = !authReady || !apiReady || !delayPassed;


  // Show loading screen with animation if backend is not ready or user is loading
  if (showLoadingScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 animate-pulse-slow px-6">
        <BotMessageSquare className="w-16 h-16 2xl:w-20 2xl:h-20 text-blue-500 animate-bounce mb-6" />
        <h1 className="text-3xl 2xl:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight animate-fadeInUp">
          Initializing AI Tutor...
        </h1>
        <p className="text-md 2xl:text-lg text-gray-600 max-w-md">
          {status === 'loading'
            ? 'Checking your session...'
            : 'Waking up the AI server. This may take up to a minute if the server was asleep.'}
        </p>

        {showProgressBar ? (
          <div className="w-full max-w-md 2xl:max-w-lg mt-8">
            <div className="h-2 bg-blue-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-progress-60s" />
            </div>
          </div>
        ) : (
          <Loader2 className="w-8 h-8 2xl:w-10 2xl:h-10 text-blue-600 animate-spin mt-6" />
        )}
        {showProgressBar && (
          <p
            key={tipIndex} // forces re-render to trigger animation
            className={`mt-8 text-sm 2xl:text-base text-gray-700 italic animate-fadeInUp transition-opacity duration-700 ${
              isTipVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'
            }`}
          >
            {loadingTips[tipIndex]}
          </p>
        )}
      </div>
    );
  }

  // Render protected page content once all checks pass
  return <>{children}</>;
}
