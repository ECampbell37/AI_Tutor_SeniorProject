/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    //Get User ID
    const { userId } = await req.json();

    // Try to fetch the user's stats (login, quiz, and topic counts)
    const { data, error } = await supabaseServer
      .from('user_stats')
      .select('total_logins, quizzes_taken, topics')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user stats:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }

    // If stats already exist, return them
    if (data) return NextResponse.json(data);

    // Otherwise, create default stats
    const defaultStats = {
      user_id: userId,
      total_logins: 0,
      quizzes_taken: 0,
      topics: [],
    };

    //Add new stats to stats table
    const { error: insertError } = await supabaseServer
      .from('user_stats')
      .insert([defaultStats]);

    if (insertError) {
      console.error('Error inserting default stats:', insertError);
      return NextResponse.json({ error: 'Failed to initialize stats' }, { status: 500 });
    }

    //Return Success
    return NextResponse.json(defaultStats);
  } catch (err) {
    console.error('Unexpected error in /api/stats:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

