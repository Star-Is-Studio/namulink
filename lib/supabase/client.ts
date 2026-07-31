import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpyoboaqdkdsskmmlkz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweW9ib2FxZGtkYnNza21tbGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODA0NDEsImV4cCI6MjEwMTA1NjQ0MX0.P_h8qY2XiYHizob-DGgn5o7f4ZcJoQtkQJJXzsEyLTQ';

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}
