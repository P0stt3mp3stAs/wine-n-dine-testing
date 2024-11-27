'use client';

import dynamic from 'next/dynamic';
import Left from '/Users/mymac/Desktop/T/src/components/Left.jsx';
import Right from '/Users/mymac/Desktop/T/src/components/Right.jsx';

// Dynamically import the 3D component with no SSR
// const Scene3D = dynamic(() => import('/components/Scene3D'), { ssr: false });

export default function SeatsPage() {
  // Values taken directly from the screenshot
  const modelValues = {
    posX: 7.4,
    posY: -8,
    posZ: 1.2,
    rotX: -0.1,
    rotY: 0,
    rotZ: 0,
    scale: 7
  };

  return (
    <main className="min-h-screen">
      <div className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      {/* <div className="w-full h-[600px] bg-yellow-400">
        <Scene3D />
      </div> */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/2 bg-red-500">
            <Left 
              position={[modelValues.posX, modelValues.posY, modelValues.posZ]}
              rotation={[modelValues.rotX * Math.PI, modelValues.rotY * Math.PI, modelValues.rotZ * Math.PI]}
              scale={modelValues.scale}
            />
          </div>
          <div className="w-full md:w-1/2 bg-yellow-400">
            <Right 
              position={[modelValues.posX, modelValues.posY, modelValues.posZ]}
              rotation={[modelValues.rotX * Math.PI, modelValues.rotY * Math.PI, modelValues.rotZ * Math.PI]}
              scale={modelValues.scale}
            />
          </div>
        </div>
      </div>
    </main>
  );
}