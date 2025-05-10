/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /lib/supabaseClient.ts
 ************************************************************/



/**
 * Supabase Client Setup – Initializes both client-side and server-side Supabase clients.
 *
 * - `supabaseClient` is used on the frontend (read-only, uses the public anon key).
 * - `supabaseServer` is used in API routes or server components (full access with service role key).
 */


import { createClient } from '@supabase/supabase-js';



/**
 * Client-side Supabase client – Uses the anonymous public key.
 * Safe for use in the browser (e.g., fetching public data, session access).
 */
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);



/**
 * Server-side Supabase client – Uses the secret service role key.
 * Provides full access to Supabase (read/write) and should never be used on the client.
 * Use only in secured API routes or server functions.
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
