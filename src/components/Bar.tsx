'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/xybar2.gltf')

function ModelWithLights() {
  const { scene } = useGLTF('/models/xybar2.gltf')
  const groupRef = useRef()

  // Define fixed position and rotation values
  const position = {
    x: 0,
    y: -5,
    z: 0
  }

  const rotation = {
    x: THREE.MathUtils.degToRad(0),
    y: THREE.MathUtils.degToRad(-45),
    z: THREE.MathUtils.degToRad(2)
  }

  const scale = {
    x: 6,
    y: 6,
    z: 6
  }

  useEffect(() => {
    if (groupRef.current) {
      // Set scale
      groupRef.current.scale.set(scale.x, scale.y, scale.z)
      
      // Set rotation
      groupRef.current.rotation.x = rotation.x
      groupRef.current.rotation.y = rotation.y
      groupRef.current.rotation.z = rotation.z
      
      // Set position
      groupRef.current.position.set(position.x, position.y, position.z)
    }
  }, [])

  return (
    <group ref={groupRef}>
      {/* Model */}
      <primitive object={scene} />
      
      {/* Ambient light */}
      <ambientLight intensity={1} />
      
      {/* Point lights */}
      <pointLight
        position={[0.2, 1.5, 0.2]}
        intensity={30}
      >
        <mesh>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      </pointLight>

      <pointLight
        position={[0.8, 0.5, 0]}
        intensity={35}
      >
        <mesh>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </pointLight>

      {/* Directional light */}
      <directionalLight
        position={[1, 1, 1]}
        intensity={1}
        castShadow
      />

      {/* Spot light */}
      <spotLight
        position={[2, 2, 2]}
        angle={0.15}
        penumbra={1}
        intensity={0.7}
        castShadow
      />
    </group>
  )
}

function CameraController() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, 0, 15)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

export default function Bar() {
  return (
    <div style={{ width: '100%', height: '900px', position: 'relative' }}>
      <Canvas shadows>
        <CameraController />
        <ModelWithLights />
      </Canvas>
    </div>
  )
}