import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Create tables if they don't exist
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firebase_uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        display_name TEXT,
        photo_url TEXT,
        referral_code TEXT NOT NULL UNIQUE,
        used_referral_code TEXT,
        balance DECIMAL(10,2) DEFAULT 0,
        total_earnings DECIMAL(10,2) DEFAULT 0,
        total_ads_watched INTEGER DEFAULT 0,
        referral_count INTEGER DEFAULT 0,
        badges TEXT[] DEFAULT '{}',
        last_spin_date TIMESTAMP,
        daily_ads_today INTEGER DEFAULT 0,
        last_ad_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ad_watches (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        earnings DECIMAL(10,2),
        watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS spins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        prize DECIMAL(10,2),
        spun_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER REFERENCES users(id),
        referred_id INTEGER REFERENCES users(id),
        earnings DECIMAL(10,2) DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        weekly_earnings DECIMAL(10,2) DEFAULT 0,
        rank INTEGER,
        week_starting TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();