'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/signin');
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        router.push('/signin');
      }
    };

    checkAuth();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="bg-gray-800 text-white p-4 text-center my-5">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p>Welcome, {user.email}!</p>
      </div>
    </main>
  );
}