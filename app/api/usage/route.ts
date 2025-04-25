// app/api/usage/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabaseServer
    .from('api_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }

  return NextResponse.json({ usage: data?.request_count ?? 0 });
}
