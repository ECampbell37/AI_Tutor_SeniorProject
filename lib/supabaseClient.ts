// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Client for use in client-side code (read-only, uses anon key)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Server-side client (full access, use only in API routes)
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
