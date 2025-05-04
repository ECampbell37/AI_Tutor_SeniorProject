/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/(protected)/chat/page.tsx
 ************************************************************/

import { Suspense } from 'react';
import ChatClient from './ChatClient';

// Displays a loading spinner while the chat interface loads query parameters and chat data.
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      }
    >
      <ChatClient />
    </Suspense>
  );
}