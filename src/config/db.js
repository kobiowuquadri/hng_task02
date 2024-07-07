import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config()

const { Pool } = pkg

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const dbUrl = process.env.POSTGRESQL_DB

if (!supabaseUrl || !supabaseAnonKey || !dbUrl) {
  throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, POSTGRESQL_DB')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

export const db = drizzle(pool)
