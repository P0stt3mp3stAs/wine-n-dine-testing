'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Group } from 'three'
import SceneLighting from './SceneLighting'

useGLTF.preload('/models/xybar2.gltf')

function ModelWithLights() {
  const { scene } = useGLTF('/models/xybar2.gltf')
  const groupRef = useRef<Group>(null)

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
      groupRef.current.scale.set(scale.x, scale.y, scale.z)
      groupRef.current.rotation.set(rotation.x, rotation.y, rotation.z)
      groupRef.current.position.set(position.x, position.y, position.z)
    }
  }, [])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <SceneLighting showLightHelpers={true} />
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