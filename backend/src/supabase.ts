import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'));
};

let client: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  client = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase Client initialized successfully.');
} else {
  console.log('⚠️ Supabase credentials not found in environment. Using in-memory database fallback.');
}

export const supabase = client;
