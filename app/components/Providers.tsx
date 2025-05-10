/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/components/Providers.tsx
 ************************************************************/


/**
 * Providers Component – Wraps the application in global context providers.
 *
 * Provides session context using NextAuth's `SessionProvider`,
 * enabling authentication state across the app.
 */

'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Wraps all child components in a session context for authentication control.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
