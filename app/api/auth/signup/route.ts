/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/auth/signup/route.ts
 ************************************************************/




/**
 * API Route: POST /api/auth/signup
 *
 * Handles user registration:
 * - Validates input
 * - Checks for username uniqueness
 * - Hashes the password securely with bcrypt
 * - Inserts new user into Supabase `users` table
 * - Returns JSON response with success or error
 */


import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseClient';



/**
 * POST handler for creating a new user account.
 * 
 * @param request - HTTP Request containing JSON with `username` and `password`
 * @returns JSON response with success message or error
 */
export async function POST(request: Request) {
  try {
    // Extract credentials from request body
    const { username, password } = await request.json();

    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().slice(0, 10);

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    // Check if the username already exists
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();  // Generate a new UUID for the user


    // Insert new user into the Supabase database
    const { error: insertError } = await supabaseServer
      .from('users')
      .insert([{ id: userId, username, hashed_password: hashedPassword }]);

    // Handle insertion error
    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }

    // After user inserted successfully into users table, create stats entry
    await supabaseServer.from('user_stats').insert([
      {
        user_id: userId,
        total_logins: 1,
        last_login: today,
        quizzes_taken: 0,
        topics: [],
      },
    ]);

    //Return success message
    return NextResponse.json({ message: 'User created successfully' });
  } catch (err) {
    // Catch unexpected server errors
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
