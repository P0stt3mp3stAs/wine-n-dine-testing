'use client';

import dynamic from 'next/dynamic';

// Dynamically import the 3D component with no SSR
const Scene3D = dynamic(() => import('@/components/Scene3D'), { ssr: false });

export default function SeatsPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      <div className="w-full h-[600px] bg-yellow-400">
        <Scene3D />
      </div>
    </main>
  );
}