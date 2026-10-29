import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ljcjbhsragnkmptbefap.supabase.co';
const SUPABASE_ANON = 'sb_publishable_012NtEo04_Pg0xORvnYHTg_TDCDFE9m';

// This works for Mentors.html and Messages.html
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { 
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: true 
  }
});