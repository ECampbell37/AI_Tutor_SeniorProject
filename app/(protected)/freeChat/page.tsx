/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/freeChat/page.tsx
 ************************************************************/

import { Suspense } from 'react';
import FreeChatClient from './FreeChatClient';


// Displays a loading spinner while the chat interface loads query parameters and chat data.
export default function FreeChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
        </div>
      }
    >
      <FreeChatClient />
    </Suspense>
  );
}
