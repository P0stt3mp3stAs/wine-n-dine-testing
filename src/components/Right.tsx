import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface Model3DProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

function Model3D({ position, scale, rotation }: Model3DProps) {
  const gltf = useGLTF('/models/bar23.glb');
  return (
    <primitive 
      object={gltf.scene} 
      scale={scale} 
      position={position}
      rotation={rotation}
    />
  );
}

interface RightProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

export default function Right({ position, scale, rotation }: RightProps) {
  return (
    <div className="h-[384px] w-4/5 bg-green-400">
      glb
      <Canvas 
        camera={{ position: [0, 2, 15], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Model3D position={position} scale={scale} rotation={rotation} />
        </Suspense>
      </Canvas>
    </div>
  );
}