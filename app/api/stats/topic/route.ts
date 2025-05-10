/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/topic/route.ts
 ************************************************************/



/**
 * This route updates the list of topics a user has explored.
 * If the topic is not already listed in user_stats.topics,
 * it appends the new topic and updates the database.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    // Get user ID and topic
    const { userId, topic } = await req.json();

    // Fetch user's currently explored topics
    const { data, error } = await supabaseServer
      .from('user_stats')
      .select('topics')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('User stats row not found');

    //Store user's explored topics
    const currentTopics = data.topics || [];

    // If topic has already been explored, return early
    if (currentTopics.includes(topic)) {
      return NextResponse.json({ updated: false });
    }

    // Append new topic to the list and update in database
    const { error: updateError } = await supabaseServer
      .from('user_stats')
      .update({ topics: [...currentTopics, topic] })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Return success response
    return NextResponse.json({ updated: true });
  } catch (err) {
    console.error('Error updating topics:', err);
    return NextResponse.json({ error: 'Failed to update topics' }, { status: 500 });
  }
}
