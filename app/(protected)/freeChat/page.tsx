/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/freeChat/page.tsx
 ************************************************************/


/**
 * Free Chat Page – Suspense-enabled wrapper for the FreeChatClient component.
 *
 * This component handles lazy loading of the main chat UI.
 * It provides a spinner fallback while waiting for the FreeChatClient to resolve dynamic data like
 * query parameters or session state (necessary for Vercel).
 */


import { Suspense } from 'react';
import FreeChatClient from './FreeChatClient';


/**
 * Renders the free chat page using React Suspense.
 * While FreeChatClient loads (e.g., fetching search params), a spinner is displayed.
 */
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
