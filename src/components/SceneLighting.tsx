'use client'

import React from 'react'
import type { ColorRepresentation } from 'three'

type Position = [number, number, number]

interface SceneLightingProps {
  ambientIntensity?: number;
  pointLight1Position?: Position;
  pointLight1Intensity?: number;
  pointLight1Color?: ColorRepresentation;
  pointLight2Position?: Position;
  pointLight2Intensity?: number;
  pointLight2Color?: ColorRepresentation;
  directionalLightPosition?: Position;
  directionalLightIntensity?: number;
  spotLightPosition?: Position;
  spotLightIntensity?: number;
  spotLightAngle?: number;
  spotLightPenumbra?: number;
  showLightHelpers?: boolean;
}

const SceneLighting: React.FC<SceneLightingProps> = ({ 
  ambientIntensity = 1,
  pointLight1Position = [0.2, 1.5, 0.2] as Position,
  pointLight1Intensity = 30,
  pointLight1Color = "yellow",
  pointLight2Position = [0.8, 0.5, 0] as Position,
  pointLight2Intensity = 35,
  pointLight2Color = "blue",
  directionalLightPosition = [1, 1, 1] as Position,
  directionalLightIntensity = 1,
  spotLightPosition = [2, 2, 2] as Position,
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