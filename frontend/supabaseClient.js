
const SUPABASE_URL = 'https://ljcjbhsragnkmptbefap.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_012NtEo04_Pg0xORvnYHTg_TDCDFE9m';

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// supabaseClient.js
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// const SUPABASE_URL  = 'https://ljcjbhsragnkmptbefap.supabase.co';
// const SUPABASE_ANON = 'sb_publishable_012NtEo04_Pg0xORvnYHTg_TDCDFE9m';

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
//   auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
// });

// export async function requireUser() {
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return null;
//   return user;
// }