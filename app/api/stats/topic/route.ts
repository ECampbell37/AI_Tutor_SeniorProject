/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/stats/topic/route.ts
 ************************************************************/

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    //Get user ID
    const { userId, topic } = await req.json();

    // Fetch current explored topics
    const { data, error } = await supabaseServer
      .from('user_stats')
      .select('topics')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('User stats row not found');

    //Store user's explored topics
    const currentTopics = data.topics || [];

    //If topic already explored, return as false
    if (currentTopics.includes(topic)) {
      return NextResponse.json({ updated: false });
    }

    //Otherwise, append new topic to explored topics list
    const { error: updateError } = await supabaseServer
      .from('user_stats')
      .update({ topics: [...currentTopics, topic] })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    //Return as updated
    return NextResponse.json({ updated: true });
  } catch (err) {
    console.error('Error updating topics:', err);
    return NextResponse.json({ error: 'Failed to update topics' }, { status: 500 });
  }
}
