'use server';

import { pool } from '@/lib/db.server';

export async function getUserReservations(userId: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM seat_reservations WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}
