/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/joined/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  //Get User ID
  const { userId } = await req.json();

  //Get the date the user created their account
  const { data, error } = await supabaseServer
    .from('users')
    .select('created_at')
    .eq('id', userId)
    .single();

  //If error, return
  if (error || !data) {
    console.error('Join date fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch join date' }, { status: 500 });
  }

  //Otherwise, return the user's join date
  return NextResponse.json({ joinedAt: data.created_at });
}
