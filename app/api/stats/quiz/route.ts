/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/quiz/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    //Get user ID
    const { userId } = await req.json();

    //Get Quiz count from Database
    const { data, error } = await supabaseServer
      .from('user_stats')
      .select('quizzes_taken')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) throw error || new Error('No stats row found');

    //New Quiz count
    const updatedCount = (data.quizzes_taken || 0) + 1;

    //Update Quiz Count
    const { error: updateError } = await supabaseServer
      .from('user_stats')
      .update({ quizzes_taken: updatedCount })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    //Return success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating quiz count:', err);
    return NextResponse.json({ error: 'Failed to update quiz count' }, { status: 500 });
  }
}
