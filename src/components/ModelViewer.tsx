'use client';

import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  PointerLockControls,
  useGLTF
} from '@react-three/drei';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';

interface ModelViewerProps {
  availableSeats?: string[];
  onSeatSelect?: (seatId: string) => void;
}

// First Person Controls
function FirstPersonController() {
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  const { scene, camera } = useThree();
  const moveSpeed = 0.15;

  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveState.current.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveState.current.backward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const checkCollision = (direction: THREE.Vector3): boolean => {
    const raycaster = new THREE.Raycaster(
      camera.position.clone(),
      direction.clone().normalize(),
      0,
      0.5
    );

    const intersects = raycaster.intersectObjects(scene.children, true);
    return intersects.some(intersect => 
      intersect.object instanceof THREE.Mesh && 
      intersect.object.userData.collidable
    );
  };

  useFrame(() => {
    if (!controlsRef.current?.isLocked) return;

    const getDirection = new THREE.Vector3();
    const rotation = camera.rotation.clone();

    if (moveState.current.forward) {
      getDirection.setFromEuler(rotation);
      if (!checkCollision(getDirection)) {
        camera.position.addScaledVector(getDirection.normalize(), moveSpeed);
      }
    }
    if (moveState.current.backward) {
      getDirection.setFromEuler(rotation);
      if (!checkCollision(getDirection.negate())) {
        camera.position.addScaledVector(getDirection.normalize(), moveSpeed);
      }
    }
    if (moveState.current.left) {
      getDirection.setFromEuler(rotation);
      getDirection.cross(camera.up);
      if (!checkCollision(getDirection.negate())) {
        camera.position.addScaledVector(getDirection.normalize(), moveSpeed);
      }
    }
    if (moveState.current.right) {
      getDirection.setFromEuler(rotation);
      getDirection.cross(camera.up);
      if (!checkCollision(getDirection)) {
        camera.position.addScaledVector(getDirection.normalize(), moveSpeed);
      }
    }
  });

  return (
    <PointerLockControls 
      ref={controlsRef as any}
      onUnlock={() => {
        const startExploring = document.getElementById('startExploring');
        if (startExploring) startExploring.style.display = 'flex';
      }}
    />
  );
}

// Model component
function Model({ url, position, id, isAvailable, onSelect }: { 
  url: string; 
  position?: [number, number, number]; 
  id?: string;
  isAvailable?: boolean;
  onSelect?: (id: string) => void;
}) {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (id) { // Only apply to interactive models
            if (isAvailable) {
              child.material.emissive = new THREE.Color(hovered ? 0x00ff00 : 0x004400);
              child.material.emissiveIntensity = hovered ? 0.5 : 0.3;
            } else {
              child.material.emissive = new THREE.Color(0x440000);
              child.material.emissiveIntensity = 0.3;
            }
          }
        }
      });
    }
  }, [hovered, isAvailable, id]);
  
  return (
    <group 
      position={position}
      ref={meshRef}
      onClick={(event) => {
        if (id && isAvailable && onSelect) {
          event.stopPropagation();
          onSelect(id);
        }
      }}
      onPointerOver={(event) => {
        if (id && isAvailable) {
          event.stopPropagation();
          setHovered(true);
        }
      }}
      onPointerOut={(event) => {
        if (id && isAvailable) {
          event.stopPropagation();
          setHovered(false);
        }
      }}
    >
      <primitive object={scene} scale={1} />
    </group>
  );
}

// Crosshair component
function Crosshair() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="absolute w-0.5 h-5 bg-white left-1/2 -translate-x-1/2 border border-black"></div>
      <div className="absolute h-0.5 w-5 bg-white top-1/2 -translate-y-1/2 border border-black"></div>
    </div>
  );
}

// Main ModelViewer component
function ModelViewer({ availableSeats = [], onSeatSelect }: ModelViewerProps) {
  return (
    <div className="w-full h-screen">
      <Crosshair />
      
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0.7, 0]
        }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 4, 0]} intensity={0.5} />
        <hemisphereLight intensity={0.5} />
        
        {/* Scene */}
        <Suspense fallback={null}>
          {/* Base model is non-interactive */}
          <Model url="/models/base/base.gltf" />
          
          {/* Interactive models */}
          <Model 
            url="/models/couch/couch.gltf" 
            id="couch" 
            isAvailable={availableSeats.includes('couch')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table/2table.gltf" 
            id="2table"
            isAvailable={availableSeats.includes('2table')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table1/2table1.gltf" 
            id="2table1"
            isAvailable={availableSeats.includes('2table1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/4table/4table.gltf" 
            id="4table"
            isAvailable={availableSeats.includes('4table')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/4table1/4table1.gltf" 
            id="4table1"
            isAvailable={availableSeats.includes('4table1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool/stool.gltf" 
            id="stool"
            isAvailable={availableSeats.includes('stool')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool1/stool1.gltf" 
            id="stool1"
            isAvailable={availableSeats.includes('stool1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool2/stool2.gltf" 
            id="stool2"
            isAvailable={availableSeats.includes('stool2')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool3/stool3.gltf" 
            id="stool3"
            isAvailable={availableSeats.includes('stool3')}
            onSelect={onSeatSelect}
          />
        </Suspense>

        <FirstPersonController />
      </Canvas>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ModelViewer), {
  ssr: false
});