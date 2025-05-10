/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/kidsChat/page.tsx
 ************************************************************/



/**
 * Kids Chat Page – Suspense-enabled wrapper for the KidsChatClient component.
 *
 * This component handles lazy loading of the main chat UI.
 * It provides a spinner fallback while waiting for the KidsChatClient to resolve dynamic data like
 * query parameters or session state (necessary for Vercel).
 */


import { Suspense } from 'react';
import KidsChatClient from './KidsChatClient';



/**
 * Renders the kids mode chat page using React Suspense.
 * While KidsChatClient loads (e.g., fetching search params), a spinner is displayed.
 */
export default function KidsChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      }
    >
      <KidsChatClient />
    </Suspense>
  );
}