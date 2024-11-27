import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Model3D({ position, scale, rotation }) {
  const gltf = useGLTF('/models/bar23.gltf');
  return (
    <primitive 
      object={gltf.scene} 
      scale={scale} 
      position={position}
      rotation={rotation} // Add rotation in radians [x, y, z]
    />
  );
}

export default function Left({ 
  position = [0, -1, 0], // Default position [x, y, z]
  scale = 5, // Default scale
  rotation = [0, 0, 0] // Default rotation in radians [x, y, z]
}) {
  return (
    <div className="h-[384px] w-4/5 bg-purple-500">
        gltf
      <Canvas 
        camera={{ position: [0, 2, 15], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Model3D 
            position={position} 
            scale={scale} 
            rotation={rotation} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}