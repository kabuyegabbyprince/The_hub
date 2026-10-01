import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://guvhwswopudwriwonudn.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_xMu8DlDMmrBFfWkPsaGEYQ_KfYXD3fc';

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);

export async function checkSupabaseConnection() {
  try {
    // Attempt a lightweight check on Supabase connection
    const { data, error } = await supabaseAdmin.from('projects').select('id').limit(1);
    if (error) {
      if (
        error.code === 'PGRST301' ||
        error.code === 'PGRST205' ||
        error.message.includes('schema cache') ||
        error.message.includes('does not exist')
      ) {
        return { connected: true, tableStatus: 'Connected (Tables not yet created in Supabase SQL editor)' };
      }
      return { connected: true, tableStatus: error.message };
    }
    return { connected: true, tableStatus: 'Tables active', count: data?.length ?? 0 };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}
