'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Loader } from '@react-three/drei';

// Pre-cache loading message
const LOADING_TEXT = "Loading 3D Model";
const modelPath = '/models/xybar2.gltf';
useGLTF.preload(modelPath); // Preload the model

function Model() {
  try {
    const { scene } = useGLTF('/models/xybar2.gltf', true);
    return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
}

// Custom loading component
function CustomLoader() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">{LOADING_TEXT}</p>
      </div>
    </div>
  );
}

export default function ModelViewer() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && <CustomLoader />}
      
      <Canvas
        gl={{ antialias: false }} // Disable antialiasing for better performance
        dpr={[1, 1.5]} // Limit pixel ratio
        camera={{
          position: [0, 2, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(window.devicePixelRatio); // Match device pixel ratio
          setIsLoading(false);
        }}
        performance={{ min: 0.5 }} // Allow performance scaling
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={1}
            castShadow={false} // Disable shadows for performance
          />
          
          <Model />
          
          <OrbitControls
            enableDamping={false}
            enableZoom={true}
            enablePan={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: 'transparent' }} // Custom loader styles
        innerStyles={{ background: 'transparent' }}
        barStyles={{ background: '#2196f3' }}
        dataStyles={{ color: '#000' }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
        initialState={(active) => active}
      />
    </div>
  );
}