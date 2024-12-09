'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardHero from '@/components/DashboardHero';

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
      Cookies.remove('accessToken');
      Cookies.remove('idToken');
      Cookies.remove('refreshToken');
      console.log('Cookies cleared');
      await signOut({ global: true });
      console.log('Amplify signout complete');
      localStorage.clear();
      console.log('Local storage cleared');
      setUserEmail(null);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during sign out:', error);
      window.location.href = '/signin';
    }
  };

  if (!userEmail) {
    return null;
  }

  return (
    <main>
      {/* Hero Section First */}
      <DashboardHero />

      {/* Dashboard Header */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
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
      </div>
    </main>
  );
}