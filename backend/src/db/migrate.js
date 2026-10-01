import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('----------------------------------------------------');
  console.log('The Hub — Automated Database Migration & Seed Tool');
  console.log('----------------------------------------------------');
  console.log(`Target Supabase URL: ${process.env.SUPABASE_URL || 'https://guvhwswopudwriwonudn.supabase.co'}`);

  try {
    const schemaPath = path.join(__dirname, '../../../schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log(`[1/3] Loaded schema.sql (${schemaSql.length} bytes)`);
    console.log(`[2/3] Loaded seed.sql (${seedSql.length} bytes)`);

    // Verify connectivity with Supabase
    console.log('[3/3] Checking Supabase database connectivity...');
    const { data, error } = await supabase.from('courses').select('id').limit(1);

    if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
      console.log(`Notice: ${error.message}`);
    } else {
      console.log('Supabase connection verified successfully.');
    }

    console.log('----------------------------------------------------');
    console.log('Migration scripts prepared and ready for execution.');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Migration notice:', err.message);
  }
}

runMigration();
