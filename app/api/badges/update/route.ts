/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/badges/update/route.ts
 ************************************************************/



/**
 * This route checks a user's current stats against predefined badge rules.
 * If any new badges qualify, it inserts them into the `badges` table.
 * Called after logins, quizzes, or topic explorations.
 */


import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';
import { BADGE_RULES } from '@/lib/badges';

export async function POST(req: NextRequest) {
  try {
    //Get user's ID (and any extra params, like quiz grade)
    const { userId, extra } = await req.json();

    // Fetch user stats from the database
    const { data: stats, error: statsError } = await supabaseServer
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (statsError) throw statsError;


    // If no stats found, return error
    if (!stats) {
      return NextResponse.json({ error: 'User stats not found. Login tracking required first.' }, { status: 400 });
    }


    // Fetch names of badges already earned by the user
    const { data: userBadges, error: badgeError } = await supabaseServer
      .from('badges')
      .select('name')
      .eq('user_id', userId);

    if (badgeError) throw badgeError;

    const earnedNames = userBadges?.map((b) => b.name) ?? [];


    // Determine which new badges should be awarded
    const newBadges = BADGE_RULES.filter((badge) => {
      return !earnedNames.includes(badge.name) && badge.condition(stats, extra);
    });


    // Insert any new badge rows into the database
    if (newBadges.length > 0) {
      const inserts = newBadges.map((badge) => ({
        user_id: userId,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        awarded_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabaseServer
        .from('badges')
        .insert(inserts);

      if (insertError) throw insertError;
    }

    // Return names of newly awarded badges (can be empty if none)
    return NextResponse.json({ awarded: newBadges.map((b) => b.name) });
  } catch (err) {
    console.error('Badge update error:', err);
    return NextResponse.json({ error: 'Failed to update badges' }, { status: 500 });
  }
}
