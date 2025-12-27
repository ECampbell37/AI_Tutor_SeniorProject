/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/layout.tsx
 ************************************************************/



/**
 * Root Layout – Global layout wrapper for the entire AI Tutor app.
 *
 * This component:
 * - Imports global CSS styles
 * - Applies a consistent Google Font (Inter)
 * - Wraps all pages with Providers (NextAuth)
 * - Renders a persistent NavBar at the top
 */


import './globals.css';
import NavBar from './components/NavBar';
import Providers from './components/Providers';
import { Inter } from 'next/font/google';
import WakeBackend from "./wakeBackend";

// Load Inter font for body
const inter = Inter({ subsets: ['latin'] });

// HTML metadata
export const metadata = {
  title: 'AI Tutor',
  description: 'Your personalized AI-powered tutoring experience.',
};


/**
 * RootLayout – wraps every page in the app.
 * Adds consistent font, authentication providers, and top navigation bar.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <WakeBackend />
          <NavBar />
          <main className="pt-[64px]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}