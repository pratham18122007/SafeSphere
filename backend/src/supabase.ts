import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

function sanitizeEnv(val?: string): string {
  if (!val) return '';
  // Strip bullet points (U+2022 / 8226), zero-width spaces, and surrounding whitespace/quotes
  return val.replace(/[\u2022\u200B\uFEFF]/g, '').trim().replace(/^["']|["']$/g, '');
}

const supabaseUrl = sanitizeEnv(process.env.SUPABASE_URL);
const serviceRoleKey = sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseKey = serviceRoleKey || sanitizeEnv(process.env.SUPABASE_KEY) || sanitizeEnv(process.env.SUPABASE_ANON_KEY);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'));
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  if (serviceRoleKey) {
    console.log('✅ Supabase Client initialized with Service Role Key (RLS Bypass enabled for backend).');
  } else {
    console.warn('⚠️ Supabase Client initialized with ANON key. Backend DB writes may fail due to RLS policies!');
  }
} else {
  console.log('⚠️ Supabase credentials not found in environment. Using in-memory database fallback.');
}

export const supabase = client;
