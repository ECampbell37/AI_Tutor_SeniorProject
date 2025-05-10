/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/quiz/route.ts
 ************************************************************/


/**
 * This route increments the number of quizzes a user has taken.
 * It retrieves the current count from the user_stats table,
 * adds one, and updates the record.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    //Get user ID
    const { userId } = await req.json();

    // Retrieve current quiz count for the user
    const { data, error } = await supabaseServer
      .from('user_stats')
      .select('quizzes_taken')
      .eq('user_id', userId)
      .maybeSingle();

    // If query failed or no data found
    if (error || !data) throw error || new Error('No stats row found');

    
    // Calculate updated quiz count
    const updatedCount = (data.quizzes_taken || 0) + 1;


    // Update quiz count in database
    const { error: updateError } = await supabaseServer
      .from('user_stats')
      .update({ quizzes_taken: updatedCount })
      .eq('user_id', userId);

      
    // Handle update error
    if (updateError) throw updateError;

    //Return success response
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating quiz count:', err);
    return NextResponse.json({ error: 'Failed to update quiz count' }, { status: 500 });
  }
}
