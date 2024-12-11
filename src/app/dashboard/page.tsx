'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardHero from '@/components/DashboardHero';
import ReservationSection from '@/components/ReservationSection';
import MenuPreview from '@/components/menu/MenuPreview';

interface UserInfo {
  email: string | null;
  username: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: null, username: null });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUserInfo({
          email: currentUser.email || null,
          username: currentUser.username || null
        });
        console.log('Logged in user:', currentUser.email);
      }
    } catch (error) {
      console.log('No user is logged in');
      setUserInfo({ email: null, username: null });
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
      await signOut();
      console.log('Signed out');
      localStorage.clear();
      console.log('Local storage cleared');
      setUserInfo({ email: null, username: null });
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during sign out:', error);
      window.location.href = '/signin';
    }
  };

  if (!userInfo.email) {
    return null;
  }

  return (
    <main>
      <DashboardHero />
      <MenuPreview />
      <ReservationSection />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black">Dashboard</h1>
                <p className="text-sm mt-2">
                  {userInfo.username && `@${userInfo.username}`}
                  <br />
                  {userInfo.email}
                </p>
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