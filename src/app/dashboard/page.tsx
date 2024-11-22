'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUserEmail(attributes.email || null);
      console.log('Logged in user:', attributes.email);
    } catch (error) {
      console.log('No user is logged in');
      setUserEmail(null);
      router.push('/signin');
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Starting signout process...');
      
      // First clear all cookies
      Cookies.remove('accessToken');
      Cookies.remove('idToken');
      Cookies.remove('refreshToken');
      console.log('Cookies cleared');
      
      // Then sign out from Amplify
      await signOut({ global: true });
      console.log('Amplify signout complete');

      // Clear any local storage
      localStorage.clear();
      console.log('Local storage cleared');

      setUserEmail(null);
      
      // Force a complete page reload and redirect
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during sign out:', error);
      // If there's an error, still try to redirect
      window.location.href = '/signin';
    }
  };

  if (!userEmail) {
    return null; // Don't render anything while redirecting
  }

  return (
    <main className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black">Dashboard</h1>
              <p className="text-sm mt-2">Logged in as: {userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}