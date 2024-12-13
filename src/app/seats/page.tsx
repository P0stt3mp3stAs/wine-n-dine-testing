// app/seats/page.tsx
'use client';

import ModelViewer from '@/components/ModelViewer';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface AvailabilityData {
  availableSeats: string[];
  success: boolean;
}

export default function SeatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        // Get currently selected seats if any
        const currentlySelectedSeats = searchParams.get('selectedSeats')?.split(',') || [];

        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: searchParams.get('date'),
            startTime: searchParams.get('startTime'),
            endTime: searchParams.get('endTime'),
            guestCount: searchParams.get('guestCount'),
            reservationType: searchParams.get('reservationType'),
            selectedSeats: currentlySelectedSeats // Pass currently selected seats to exclude them
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AvailabilityData = await response.json();
        
        if (data.success) {
          setAvailableSeats(data.availableSeats);
        } else {
          throw new Error('Failed to get availability data');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        alert('Failed to load available seats. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, [searchParams]);

  const handleSeatSelect = (seatId: string) => {
    // Get current selected seats
    const currentSeats = searchParams.get('selectedSeats')?.split(',').filter(Boolean) || [];
    const newSeats = [...currentSeats, seatId];
    
    // Create new params with updated seats
    const params = new URLSearchParams(searchParams.toString());
    params.set('selectedSeats', newSeats.join(','));
    
    router.push(`/seats/confirm?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading available seats...</div>
      </div>
    );
  }

  return (
    <main className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 text-center mt-20">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      <div className="absolute top-28 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">Available Seats</h2>
        <p className="text-sm text-gray-600">Green seats are available for your selection</p>
        <p className="text-sm text-gray-600">Red seats are already reserved</p>
        <div className="mt-4 text-sm">
          <p><strong>Date:</strong> {searchParams.get('date')}</p>
          <p><strong>Time:</strong> {searchParams.get('startTime')} - {searchParams.get('endTime')}</p>
          <p><strong>Guests:</strong> {searchParams.get('guestCount')}</p>
          <p><strong>Type:</strong> {searchParams.get('reservationType')}</p>
        </div>
      </div>
      <div>
        <ModelViewer 
          availableSeats={availableSeats} 
          onSeatSelect={handleSeatSelect}
        />
      </div>
    </main>
  );
}