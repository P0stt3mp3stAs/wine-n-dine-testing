'use client'

import React from 'react'
import { useThree } from '@react-three/fiber'

const SceneLighting = ({ 
  ambientIntensity = 1,
  pointLight1Position = [0.2, 1.5, 0.2],
  pointLight1Intensity = 30,
  pointLight1Color = "yellow",
  pointLight2Position = [0.8, 0.5, 0],
  pointLight2Intensity = 35,
  pointLight2Color = "blue",
  directionalLightPosition = [1, 1, 1],
  directionalLightIntensity = 1,
  spotLightPosition = [2, 2, 2],
  spotLightIntensity = 0.7,
  spotLightAngle = 0.15,
  spotLightPenumbra = 1,
  showLightHelpers = false
}) => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* Point lights */}
      <pointLight
        position={pointLight1Position}
        intensity={pointLight1Intensity}
      >
        {showLightHelpers && (
          <mesh>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={pointLight1Color} />
          </mesh>
        )}
      </pointLight>

      <pointLight
        position={pointLight2Position}
        intensity={pointLight2Intensity}
      >
        {showLightHelpers && (
          <mesh>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={pointLight2Color} />
          </mesh>
        )}
      </pointLight>

      {/* Directional light */}
      <directionalLight
        position={directionalLightPosition}
        intensity={directionalLightIntensity}
        castShadow
      />

      {/* Spot light */}
      <spotLight
        position={spotLightPosition}
        angle={spotLightAngle}
        penumbra={spotLightPenumbra}
        intensity={spotLightIntensity}
        castShadow
      />
    </>
  )
}

export default SceneLighting