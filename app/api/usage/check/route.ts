/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/usage/check/route.ts
 ************************************************************/

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

  //If error, return
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ allowed: false, error: 'Failed to check usage' }, { status: 500 });
  }

  //Set usage count
  const currentCount = data?.request_count ?? 0;

  //If usage is over daily limit, user is not allowed to use API
  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json({ allowed: false });
  }

  // If no data exists, insert new row for user. Otherwise, increment user's usage count in database
  if (!data) {
    const { error: insertError } = await supabaseServer
      .from('api_usage')
      .insert({ user_id: userId, date: today, request_count: 1 });
    if (insertError) {
      return NextResponse.json({ allowed: false, error: 'Failed to insert usage' }, { status: 500 });
    }
  } else {
    const { error: updateError } = await supabaseServer
      .from('api_usage')
      .update({ request_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('date', today);
    if (updateError) {
      return NextResponse.json({ allowed: false, error: 'Failed to update usage' }, { status: 500 });
    }
  }

  //User is allowed to use API
  return NextResponse.json({ allowed: true });
}
