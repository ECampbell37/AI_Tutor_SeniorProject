/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/auth/signup/route.ts
 ************************************************************/


import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    //Get username and password
    const { username, password } = await request.json();

    //If one or more is missing, return error
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    // Check if username exists
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Hash password and generate UUID
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    //Create new user
    const { error: insertError } = await supabaseServer
      .from('users')
      .insert([{ id: userId, username, hashed_password: hashedPassword }]);

    //If error, return
    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }

    //Return success message
    return NextResponse.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
