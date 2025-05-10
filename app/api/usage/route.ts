/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/usage/route.ts
 ************************************************************/


/**
 * API Usage Route – Returns how many API requests the user has made today.
 * This is used to enforce and visualize daily usage limits.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';


export async function POST(req: NextRequest) {
  //Get user's ID
  const { userId } = await req.json();

  //Get today's date
  const today = new Date().toISOString().slice(0, 10);

  //Retrieve User API Usage from Database
  const { data, error } = await supabaseServer
    .from('api_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  // Handle database error
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }

  // Return the request count (or 0 if not found)
  return NextResponse.json({ usage: data?.request_count ?? 0 });
}
