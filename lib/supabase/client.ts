import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpyoboaqdkdbsskmmlkz.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_2aE3okacstnf1HyHpjMGQA_TBvt7JVe'
  );
}
