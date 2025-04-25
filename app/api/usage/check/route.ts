// app/api/usage/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

const DAILY_LIMIT = 100;

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabaseServer
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ allowed: false, error: 'Failed to check usage' }, { status: 500 });
  }

  const currentCount = data?.request_count ?? 0;

  if (currentCount >= DAILY_LIMIT) {
    return NextResponse.json({ allowed: false });
  }

  // Insert or update
  if (!data) {
    const { error: insertError } = await supabaseServer
      .from('api_usage')
      .insert({ user_id: userId, date: today, request_count: 1 });
    if (insertError) {
      return NextResponse.json({ allowed: false, error: 'Failed to insert usage' }, { status: 500 });
    }
  } else {
    const { error: updateError } = await supabaseServer
      .from('api_usage')
      .update({ request_count: currentCount + 1 })
      .eq('user_id', userId)
      .eq('date', today);
    if (updateError) {
      return NextResponse.json({ allowed: false, error: 'Failed to update usage' }, { status: 500 });
    }
  }

  return NextResponse.json({ allowed: true });
}
