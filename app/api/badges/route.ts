/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/badges/route.ts
 ************************************************************/


/**
 * This route retrieves all the badges awarded to a specific user.
 * Used on the account page to show badge progress and achievements.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  //Get User ID
  const { userId } = await req.json();


  // Query the badges table for this user, ordered by most recent first
  const { data, error } = await supabaseServer
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  // Return an error if the query fails
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }

  // Return the badge list
  return NextResponse.json(data);
}
