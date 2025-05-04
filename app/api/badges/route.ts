/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/badges/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  //Get User ID
  const { userId } = await req.json();

  //Get all user's badges from Database
  const { data, error } = await supabaseServer
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false });

  //If error, return
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }

  //Otherwise, return user's badges
  return NextResponse.json(data);
}
