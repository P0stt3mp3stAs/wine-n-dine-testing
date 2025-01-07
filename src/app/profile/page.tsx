'use client';
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { getUserReservations } from '@/actions/reservations';
// import UserReservations from '@/components/UserReservations';

interface Reservation {
  id: number;
  user_id: string;
  seat_id: number;
  reservation_date: Date;
  start_time: string;
  end_time: string;
  guest_count: number;
  reservation_type: string;
  is_primary: boolean;
  reservation_group_id: string;
}

export default function Profile() {
  const { 
    userInfo, 
    setUserInfo, 
    isLoading, 
    error, 
    setError, 
    handleSignOut, 
    handleDeleteAccount 
  } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);


  useEffect(() => {
    if (userInfo?.user_id) {
      getUserReservations(userInfo.user_id)
        .then(data => setReservations(data));
    }
  }, [userInfo?.user_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8  text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  @{userInfo.username}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userInfo.email}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Sign Out
              </button>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-center text-red-600 font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <p>User ID: {userInfo?.user_id || 'Not available'}</p>
          <div className="reservations-section">
            <h2>Your Reservations</h2>
            {reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <p>Date: {new Date(reservation.reservation_date).toLocaleDateString()}</p>
                <p>Time: {reservation.start_time} - {reservation.end_time}</p>
                <p>Guests: {reservation.guest_count}</p>
                <p>Type: {reservation.reservation_type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}