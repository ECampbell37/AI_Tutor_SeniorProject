// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into Supabase
    const { error: insertError } = await supabaseServer
      .from('users')
      .insert([{ username, hashed_password: hashedPassword }]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
