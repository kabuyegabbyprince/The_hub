import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://guvhwswopudwriwonudn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yg9_DBFxvCnOFrbt3oU3WA_4KgyjoF3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
