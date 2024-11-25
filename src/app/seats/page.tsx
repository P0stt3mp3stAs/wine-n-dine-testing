// import Bar from "@/components/Bar";
// import ModelViewer from "@/components/ModelViewer";
// import React from "react";

// export default async function Seats() {

//   return (
//     <main className="min-h-screen bg-sky-300">
//       <div className="bg-gray-800 text-white p-4 text-center my-5">
//         <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
//       </div>
//       <div className="flex justify-center">
//         <div className="bg-yellow-400 w-4/5">
//             <ModelViewer/>
//         </div>
//       </div>
//     </main>
// )}

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[600px] bg-yellow-400">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold">Loading viewer...</p>
      </div>
    </div>
  )
});

export default function Seats() {
  return (
    <main className="min-h-screen bg-sky-300">
      <div className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      <div className="w-full h-[600px] bg-yellow-400">
        <Suspense fallback={
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <ModelViewer />
        </Suspense>
      </div>
    </main>
  );
}