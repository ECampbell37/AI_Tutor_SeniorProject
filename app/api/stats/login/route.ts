/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/login/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  //Get user ID
  const { userId } = await req.json();

  //Get today's date
  const today = new Date().toISOString().slice(0, 10);

  //Get User Login data from database
  const { data: stats, error } = await supabaseServer
    .from('user_stats')
    .select('last_login, total_logins')
    .eq('user_id', userId)
    .single();

  //If not found, return not found error
  if (error || !stats) return NextResponse.json({ error: 'Stats not found' }, { status: 500 });

  //If already logged in for the day, return
  if (stats.last_login === today) {
    return NextResponse.json({ message: 'Already logged today' });
  }

  //If not logged in today, increment login count
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
