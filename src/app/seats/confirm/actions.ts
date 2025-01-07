'use server'

import { createReservation } from '@/lib/db';

export async function createReservationAction(
  userId: string,
  seatId: string,
  date: string,
  startTime: string,
  endTime: string,
  guestCount: number,
  reservationType: 'drink-only' | 'dine-and-eat'
) {
  try {
    await createReservation(
      userId,
      [seatId],
      date,
      startTime,
      endTime,
      guestCount,
      reservationType
    );
    return { success: true };
  } catch (error) {
    console.error('Error creating reservation:', error);
    return { success: false, error: 'Failed to create reservation' };
  }
}
