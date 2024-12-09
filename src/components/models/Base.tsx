// components/restaurant/models/Base.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ModelProps {
  onLoad?: () => void;
}

interface GLTFResult {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  scene: THREE.Group;
}

const LOAD_DISTANCE = 30;
const LOD_DISTANCES = {
  HIGH: 10,
  MEDIUM: 20,
  LOW: 30
};

const Base: React.FC<ModelProps> = ({ onLoad }) => {
  const [isVisible, setIsVisible] = useState(true);
  const modelRef = useRef<THREE.Group>(null);
  const lodRef = useRef<THREE.LOD | null>(null);
  const gltf = useGLTF('/models/base/untitled.gltf') as unknown as GLTFResult;

  useEffect(() => {
    if (!modelRef.current) return;

    const lod = new THREE.LOD();

    const highDetail = gltf.scene.clone();
    const mediumDetail = gltf.scene.clone();
    const lowDetail = gltf.scene.clone();

    mediumDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry.clone();
        const modifier = new THREE.SimplifyModifier();
        const simplified = modifier.modify(geometry, 
          Math.floor(geometry.attributes.position.count * 0.5));
        child.geometry = simplified;
      }
    });

    lowDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry.clone();
        const modifier = new THREE.SimplifyModifier();
        const simplified = modifier.modify(geometry, 
          Math.floor(geometry.attributes.position.count * 0.25));
        child.geometry = simplified;
      }
    });

    lod.addLevel(highDetail, 0);
    lod.addLevel(mediumDetail, LOD_DISTANCES.HIGH);
    lod.addLevel(lowDetail, LOD_DISTANCES.MEDIUM);

    lodRef.current = lod;
    modelRef.current.add(lod);

    return () => {
      lod.dispose();
    };
  }, [gltf]);

  useFrame((state) => {
    if (!modelRef.current) return;

    const distance = state.camera.position.distanceTo(
      modelRef.current.position
    );

    if (distance > LOAD_DISTANCE && isVisible) {
      setIsVisible(false);
    } else if (distance <= LOAD_DISTANCE && !isVisible) {
      setIsVisible(true);
    }

    if (lodRef.current) {
      lodRef.current.update(state.camera);
    }
  });

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeVertexNormals();
        if (child.material) {
          child.material.dispose();
        }
      }
    });
    
    onLoad?.();

    return () => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, [gltf, onLoad]);

  if (!isVisible) return null;

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default Base;
useGLTF.preload('/models/base/untitled.gltf');