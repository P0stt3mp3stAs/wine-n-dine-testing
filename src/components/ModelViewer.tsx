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

// Raycaster for interaction
function useRaycaster() {
  const { camera, scene } = useThree();
  const raycaster = new THREE.Raycaster();
  const rayDirection = new THREE.Vector3();

  const checkIntersection = useCallback(() => {
    rayDirection.set(0, 0, -1);
    rayDirection.unproject(camera);
    rayDirection.sub(camera.position).normalize();

    raycaster.set(camera.position, rayDirection);
    raycaster.near = 0;
    raycaster.far = 100;

    const intersects = raycaster.intersectObjects(scene.children, true);
    return intersects.find(intersect => 
      intersect.object instanceof THREE.Mesh && 
      intersect.object.userData.interactive
    );
  }, [camera, scene.children]);

  return checkIntersection;
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

// Base model component (non-interactive)
function BaseModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.userData.collidable = true;
      }
    });
  }, [scene]);
  
  return <primitive object={scene} scale={1} />;
}

// Interactive model component with improved hit detection
function Model({ url, position, id }: { url: string; position?: [number, number, number]; id?: string }) {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>();
  
  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.userData.collidable = true;
        object.userData.modelId = id;
        object.userData.interactive = true;
        // Compute accurate bounding box
        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();
      }
    });
  }, [scene, id]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (hovered) {
            child.material.emissive = new THREE.Color(0xff0000);
            child.material.emissiveIntensity = 0.5;
          } else {
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          }
        }
      });
    }
  }, [hovered]);

  // Use custom raycaster for better hit detection
  const checkIntersection = useRaycaster();

  useFrame(() => {
    const intersection = checkIntersection();
    if (intersection?.object.userData.modelId === id) {
      if (!hovered) setHovered(true);
    } else if (hovered) {
      setHovered(false);
    }
  });
  
  return (
    <group 
      position={position}
      ref={meshRef}
      onClick={(event) => {
        event.stopPropagation();
        const intersection = checkIntersection();
        if (intersection?.object.userData.modelId === id) {
          console.log('Clicked model ID:', id);
        }
      }}
    >
      <primitive object={scene} scale={1} />
    </group>
  );
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
    return intersects.some(intersect => intersect.object instanceof THREE.Mesh && intersect.object.userData.collidable);
  };

  useFrame(() => {
    if (!controlsRef.current?.isLocked) return;

    const getDirection = new THREE.Vector3();
    const rotation = camera.rotation.clone();

    if (moveState.current.forward) {
      getDirection.setFromEuler(rotation);
      if (!checkCollision(getDirection)) {
        controlsRef.current.moveForward(moveSpeed);
      }
    }
    if (moveState.current.backward) {
      getDirection.setFromEuler(rotation);
      if (!checkCollision(getDirection.negate())) {
        controlsRef.current.moveForward(-moveSpeed);
      }
    }
    if (moveState.current.left) {
      getDirection.setFromEuler(rotation);
      getDirection.cross(camera.up);
      if (!checkCollision(getDirection.negate())) {
        controlsRef.current.moveRight(-moveSpeed);
      }
    }
    if (moveState.current.right) {
      getDirection.setFromEuler(rotation);
      getDirection.cross(camera.up);
      if (!checkCollision(getDirection)) {
        controlsRef.current.moveRight(moveSpeed);
      }
    }
  });

  return (
    <PointerLockControls 
      ref={controlsRef}
      onUnlock={() => {
        const startExploring = document.getElementById('startExploring');
        if (startExploring) startExploring.style.display = 'flex';
      }}
    />
  );
}

// Start screen component
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div 
      id="startExploring" 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
    >
      <div className="text-center text-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Restaurant Walkthrough</h2>
        <p className="mb-4">
          Use WASD or Arrow Keys to move<br />
          Mouse to look around<br />
          Click to interact with furniture<br />
          ESC to exit
        </p>
        <button
          onClick={onStart}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}

// Main viewer component
function RestaurantViewer() {
  const [showStart, setShowStart] = useState(true);

  const handleStart = useCallback(() => {
    setShowStart(false);
    const startExploring = document.getElementById('startExploring');
    if (startExploring) startExploring.style.display = 'none';
  }, []);

  return (
    <div className="w-full h-screen">
      <Crosshair />
      <StartScreen onStart={handleStart} />
      
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
          <BaseModel url="/models/base/base.gltf" />

          {/* Interactive models */}
          <Model url="/models/couch/couch.gltf" id="couch" />
          <Model url="/models/2table/2table.gltf" id="2table" />
          <Model url="/models/2table1/2table1.gltf" id="2table1" />
          <Model url="/models/4table/4table.gltf" id="4table" />
          <Model url="/models/4table1/4table1.gltf" id="4table1" />
          <Model url="/models/stool/stool.gltf" id="stool" />
          <Model url="/models/stool1/stool1.gltf" id="stool1" />
          <Model url="/models/stool2/stool2.gltf" id="stool2" />
          <Model url="/models/stool3/stool3.gltf" id="stool3" />
        </Suspense>

        <FirstPersonController />
      </Canvas>
    </div>
  );
}

export default dynamic(() => Promise.resolve(RestaurantViewer), {
  ssr: false
});
