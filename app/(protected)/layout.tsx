'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, BotMessageSquare } from 'lucide-react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);

  // Delay to avoid visual flash
  useEffect(() => {
    const timeout = setTimeout(() => setDelayPassed(true), 1100);
    return () => clearTimeout(timeout);
  }, []);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/account');
    } else if (status === 'authenticated') {
      setAuthReady(true);
    }
  }, [status, router]);

  // Check if API is awake
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
        setTimeout(checkApi, 3000); // retry
      }
    };

    if (authReady) {
      checkApi();
    }
  }, [authReady]);

  const showLoadingScreen = !authReady || !apiReady || !delayPassed;

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

  return <>{children}</>;
}
