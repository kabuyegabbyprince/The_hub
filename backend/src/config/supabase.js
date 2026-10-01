import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://guvhwswopudwriwonudn.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yg9_DBFxvCnOFrbt3oU3WA_4KgyjoF3';

export const supabase = createClient(supabaseUrl, supabaseKey);
