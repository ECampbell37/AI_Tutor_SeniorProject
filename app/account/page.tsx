/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/account/page.tsx
 ************************************************************/



/**
 * Account Page – Displays personalized usage, stats, and progress for the logged-in user.
 *
 * This page shows:
 * - Join date and role
 * - API usage progress bar
 * - Number of logins, quizzes taken, topics explored
 * - Earned badges and visual rewards
 * - Buttons to return home or sign out
 *
 * Also handles backend sync via API to fetch:
 * - Account creation date
 * - API usage for the day
 * - Badges earned
 * - Session tracking and login count
 */



'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, UserCircle, Sparkles, Lock, GaugeCircle, 
  UserCheck, NotebookPen, Trophy, ChartNoAxesCombined, Undo2} from 'lucide-react';
import Link from 'next/link';
import type { UserStats } from '@/lib/badges';


//API Daily User Limit
const DAILY_LIMIT = 100;


//Defines type for badge state var
type Badge = {
  id: string;
  badge_id?: string;
  name: string;
  description: string;
  icon: string;
  awarded_at: string;
};



/**
 * Renders the account dashboard for the logged-in user.
 * Includes usage tracking, badge display, and user statistics.
 */
export default function AccountPage() {
  // Session
  const { data: session, status } = useSession();

  // State variables
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [usage, setUsage] = useState<number>(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_logins: 0,
    quizzes_taken: 0,
    topics: [],
  });


  // Store user ID locally for use across client components
  useEffect(() => {
    if (session?.user?.id) {
      sessionStorage.setItem('user_id', session.user.id);
    }
  }, [session]);
  


  // Fetch join date from database backend
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchJoinDate = async () => {
      if (!session?.user?.id) return;
  
      const res = await fetch('/api/joined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
  
      const data = await res.json();
      if (data?.joinedAt) setJoinedAt(data.joinedAt);
    };
  
    fetchJoinDate();
  }, [status, session]);
  



  // Track today's login and update badge progress
  useEffect(() => {
    if (status !== 'authenticated') return;

    const trackLogin = async () => {
      if (!session?.user?.id) return;

      await fetch('/api/stats/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });

      await fetch('/api/badges/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
    };

    trackLogin();
  }, [status, session]);
  


  // Get current daily API usage count
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchUsage = async () => {
      if (!session?.user?.id) return;
  
      const res = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
  
      const data = await res.json();
      setUsage(data?.usage ?? 0);
    };
  
    fetchUsage();
  }, [status, session]);



  // Fetch all badges earned by the user
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchBadges = async () => {
      if (!session?.user?.id) return;

      const res = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const data = await res.json();
      setBadges(data || []);
    };

    fetchBadges();
  }, [status, session]);



  // Get general usage stats (logins, quizzes, topics)
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchStats = async () => {
      if (!session?.user?.id) return;
  
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
  
      const data = await res.json();
      if (!data.error) setStats(data);
    };
  
    fetchStats();
  }, [status, session]);



  // If user is not signed in, show locked screen
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-md p-10 sm:p-14 rounded-3xl shadow-2xl text-center max-w-md w-full transition-transform duration-300 ease-in-out animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Lock className="ml-1 h-16 w-16" /> You&apos;re not signed in
          </h1>
          <p className="mt-6 text-gray-700 mb-8 text-base sm:text-lg">
            To access your account and enjoy all the features, please log in.
          </p>
          <Link href="/signin" className="inline-block w-full hover:no-underline">
            <button className="w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  //Set user session and user's usage percentage
  const user = session.user;
  const usagePercent = Math.min((usage / DAILY_LIMIT) * 100, 100);

  // Render main account dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-6 py-16">
      {/* Account Header */}
      <div className="max-w-3xl w-full bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl text-center animate-fadeIn">
        <div className="inline-block mb-6 animate-bounce-slow">
          <UserCircle className="text-blue-500 w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name || 'Learner'}!</h1>
        <p className="text-gray-600 mb-6">Here&apos;s a quick look at your usage and progress</p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
          <div className="bg-white bg-opacity-70 border border-blue-200 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">🗓️ Joined</h2>
            <p className="text-sm text-gray-700">
              {joinedAt ? new Date(joinedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              }) : '—'}
            </p>
          </div>
          <div className="bg-white bg-opacity-70 border border-purple-200 p-5 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-purple-600 mb-2">🎓 Role</h2>
            <p className="text-sm text-gray-700">Student</p>
          </div>
        </div>
        
        {/* Divider */}
        <div className="my-10 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30" />
  
        {/* --- USER STATS SECTION --- */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center justify-center gap-2">
            <ChartNoAxesCombined className="text-sky-500" /> Your Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Daily Logins */}
            <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserCheck className="text-blue-500 w-7 h-7" />
              </div>
              <h3 className="text-blue-700 font-semibold text-md">Daily Logins</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.total_logins}</p>
            </div>

            {/* Quizzes Taken */}
            <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="bg-purple-100 p-3 rounded-full">
                <NotebookPen className="text-purple-500 w-7 h-7" />
              </div>
              <h3 className="text-purple-700 font-semibold text-md">Quizzes Taken</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.quizzes_taken}</p>
            </div>

            {/* Topics Explored */}
            <div className="bg-white bg-opacity-80 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="bg-green-100 p-3 rounded-full">
                <Sparkles className="text-green-500 w-7 h-7" />
              </div>
              <h3 className="text-green-700 font-semibold text-md">Topics Explored</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.topics?.length || 0}</p>
            </div>
          </div>
        </div>

  
        {/* Divider */}
        <div className="my-10 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30" />
  
        {/* --- BADGES SECTION --- */}
        {badges.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
              <Trophy className="text-yellow-400" /> Your Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white bg-opacity-80 border border-yellow-300 rounded-xl p-4 shadow hover:scale-105 transition-transform duration-200 text-center"
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10 text-center">
            <h2 className="text-xl font-bold text-blue-700 mb-2">🏅 No Badges Yet</h2>
            <p className="text-sm text-gray-600">Complete quizzes to start earning badges!</p>
          </div>
        )}

        {/* Divider */}
        <div className="my-10 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30" />


        {/* --- API USAGE SECTION --- */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GaugeCircle className="text-blue-600" size={20} />
            <h2 className="text-md font-semibold text-blue-700">Daily Usage Limit</h2>
          </div>
          <div className="relative w-full h-5 rounded-full bg-gray-200 overflow-hidden shadow-inner">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-in-out"
              style={{
                width: `${usagePercent}%`,
                background: `linear-gradient(to right,
                  #3b82f6,
                  ${usagePercent < 50 ? '#6366f1' : usagePercent < 80 ? '#a855f7' : '#ef4444'})`,
              }}
            />
            <div
              className="absolute -top-5 text-xs font-bold text-gray-800 transition-all duration-300"
              style={{
                left: `calc(${usagePercent}% - 25px)`,
              }}
            >
              {Math.floor(usagePercent)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {`${usage} / ${DAILY_LIMIT} AI Messages used today`}
          </p>
        </div>
  
        {/* Button Row */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Back to Home */}
          <Link href="/" className="hover:no-underline">
            <button className="bg-transparent text-sky-600 hover:bg-gradient-to-r hover:from-sky-300 hover:via-cyan-400 hover:to-sky-500 hover:text-white font-medium py-2 px-6 rounded-full flex items-center transition-all duration-300 hover:scale-105">
              <Undo2 className="mr-2 h-5 w-5" />
              Back to Home
            </button>
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut()}
            className="bg-transparent text-rose-600 hover:bg-gradient-to-r hover:from-rose-500 hover:via-red-500 hover:to-rose-700 hover:text-white font-semibold py-2 px-6 rounded-full flex items-center transition-all duration-300 hover:scale-105"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
