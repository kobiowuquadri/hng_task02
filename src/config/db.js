import { createClient } from '@supabase/supabase-js'
import { Drizzle } from 'drizzle-orm'
import Pool from 'pg'

const { Pool } = pg


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pool = new Pool({
  connectionString: supabaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

export const drizzle = new Drizzle(pool)
