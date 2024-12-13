// app/seats/confirm/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ConfirmSeatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    // Get current selected seat and add it to the array
    const currentSeat = searchParams.get('selectedSeat');
    if (currentSeat && !selectedSeats.includes(currentSeat)) {
      setSelectedSeats(prev => [...prev, currentSeat]);
    }
  }, [searchParams]);

  const handleAddAnotherSeat = () => {
    // Preserve all current params and add selected seats
    const params = new URLSearchParams(searchParams.toString());
    params.delete('selectedSeat'); // Remove single seat parameter
    params.set('selectedSeats', selectedSeats.join(',')); // Add all selected seats
    router.push(`/seats?${params.toString()}`);
  };

  const handleProceedToMenu = () => {
    // Create params for menu page including all selections
    const params = new URLSearchParams();
    params.set('date', searchParams.get('date') || '');
    params.set('startTime', searchParams.get('startTime') || '');
    params.set('endTime', searchParams.get('endTime') || '');
    params.set('guestCount', searchParams.get('guestCount') || '');
    params.set('reservationType', searchParams.get('reservationType') || '');
    params.set('selectedSeats', selectedSeats.join(','));
    
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Selected Seats</h1>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Reservation Details:</h2>
            <p><strong>Date:</strong> {searchParams.get('date')}</p>
            <p><strong>Time:</strong> {searchParams.get('startTime')} - {searchParams.get('endTime')}</p>
            <p><strong>Guests:</strong> {searchParams.get('guestCount')}</p>
            <p><strong>Type:</strong> {searchParams.get('reservationType')}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Selected Seats:</h2>
            <ul className="list-disc list-inside">
              {selectedSeats.map((seat, index) => (
                <li key={seat}>
                  {seat} {index === 0 ? '(Primary)' : '(Additional)'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddAnotherSeat}
            className="flex-1 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Add Another Seat
          </button>
          
          <button
            onClick={handleProceedToMenu}
            className="flex-1 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Proceed to Menu
          </button>
        </div>
      </div>
    </div>
  );
}