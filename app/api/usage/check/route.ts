/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/usage/check/route.ts
 ************************************************************/


/**
 * Checks whether a user is allowed to make an API request based on their current usage.
 * If allowed, it increments their usage count for the day.
 * Enforces a daily limit of 100 requests per user.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

//User Daily API Limit
const DAILY_LIMIT = 100;

export async function POST(req: NextRequest) {
  //Get User ID
  const { userId } = await req.json();

  //Get today's date
  const today = new Date().toISOString().slice(0, 10);

  //Get User API Usage from Database
  const { data, error } = await supabaseServer
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  // If error occurs (except "no rows found"), return failure
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ allowed: false, error: 'Failed to check usage' }, { status: 500 });
  }

  // Get current usage count (defaults to 0 if no entry found)
  const currentCount = data?.request_count ?? 0;

  // Block the request if the user has reached their daily limit
  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json({ allowed: false });
  }

  // If no usage entry exists, insert a new one with count = 1
  if (!data) {
    const { error: insertError } = await supabaseServer
      .from('api_usage')
      .insert({ user_id: userId, date: today, request_count: 1 });
    if (insertError) {
      return NextResponse.json({ allowed: false, error: 'Failed to insert usage' }, { status: 500 });
    }
  } else {
    // Otherwise, increment the user's request count by 1
    const { error: updateError } = await supabaseServer
      .from('api_usage')
      .update({ request_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('date', today);
    if (updateError) {
      return NextResponse.json({ allowed: false, error: 'Failed to update usage' }, { status: 500 });
    }
  }

  // User is allowed and usage has been updated
  return NextResponse.json({ allowed: true });
}
