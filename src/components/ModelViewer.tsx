'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState } from 'react';

function Model() {
  const gltf = useGLTF('/models/xybar2.gltf');
  return <primitive object={gltf.scene} scale={1} position={[0, -1, 0]} />;
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-2xl">Loading 3D Scene...</div>
    </div>
  );
}

export default function ThreeDPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-screen">
      {isLoading && <LoadingScreen />}
      
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Scene */}
          <Model />
          
          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Pre-load the model
useGLTF.preload('/models/xybar2.gltf');