/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/login/route.ts
 ************************************************************/



/**
 * This route tracks daily login activity.
 * It checks if the user has already logged in today,
 * and if not, updates their last_login date and increments total_logins.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  //Get user ID
  const { userId } = await req.json();

  // Get today's date (YYYY-MM-DD format)
  const today = new Date().toISOString().slice(0, 10);


  // Fetch user's login data (last login date and total logins)
  const { data: stats, error } = await supabaseServer
    .from('user_stats')
    .select('last_login, total_logins')
    .eq('user_id', userId)
    .single();

    
  // If user stats not found or query failed
  if (error || !stats) return NextResponse.json({ error: 'Stats not found' }, { status: 500 });

  // If user has already logged in today, return early
  if (stats.last_login === today) {
    return NextResponse.json({ message: 'Already logged today' });
  }


  // Otherwise, increment total logins and update last_login to today
  const { error: updateError } = await supabaseServer
    .from('user_stats')
    .update({
      last_login: today,
      total_logins: (stats.total_logins ?? 0) + 1,
    })
    .eq('user_id', userId);

  //Handle update error
  if (updateError) {
    return NextResponse.json({ error: 'Failed to update login' }, { status: 500 });
  }

  //Return success
  return NextResponse.json({ success: true });
}
