import { Pool } from 'pg';

// Use environment variables for secure configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Only for AWS RDS, remove in production if using proper SSL
  }
});

export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}