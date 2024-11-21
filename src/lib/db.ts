// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'elghali',
//   host: 'database-instance.cposom22eqj3.us-east-1.rds.amazonaws.com', // Update if the DB is hosted remotely
//   database: 'database_name',
//   password: 'SecurePass123!',
//   port: 5432, // Default PostgreSQL port
// });

// export async function query(text: string, params?: any[]) {
//   const res = await pool.query(text, params);
//   return res.rows;
// }