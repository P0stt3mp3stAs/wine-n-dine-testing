'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Preload the model and its associated files
useGLTF.preload('/models/xybar2.gltf')

function Model({ positionX = 0, positionZ = 0 }) {
  const { scene } = useGLTF('/models/xybar2.gltf')
  const modelRef = useRef()

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(5, 5, 5)
      modelRef.current.rotation.y = THREE.MathUtils.degToRad(-45)
      modelRef.current.rotation.x = THREE.MathUtils.degToRad(10)
      modelRef.current.position.set(positionX, -2, positionZ)
    }
  }, [positionX, positionZ])

  return <primitive object={scene} ref={modelRef} />
}

function Lights({ intensity }) {
  return (
    <>
      <ambientLight intensity={intensity * 0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={intensity}
        castShadow
      />
      <pointLight position={[-5, -5, -5]} intensity={intensity * 0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={intensity * 0.5}
        castShadow
      />
    </>
  )
}

function VisibleLights({ intensity }) {
  return (
    <>
      <pointLight position={[-1, 6, 0]} intensity={intensity}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      </pointLight>
      <pointLight position={[2, -2, 2]} intensity={100}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </pointLight>
    </>
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

export default function ObjectViewer() {
  const [lightIntensity, setLightIntensity] = useState(1)

  return (
    <div style={{ width: '100%', height: '900px', position: 'relative' }}>
      <Canvas shadows>
        <CameraController />
        <Lights intensity={lightIntensity} />
        <VisibleLights intensity={lightIntensity} />
        <Model positionX={0} positionZ={0} />
        <OrbitControls />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <label>
          Light Intensity:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}