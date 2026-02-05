import React from 'react';
import type { ThreeLightConfig } from '@rendervid/core';

export interface LightsProps {
  lights: ThreeLightConfig[];
}

/**
 * Lights component that renders all scene lights.
 * Supports ambient, directional, point, spot, and hemisphere lights.
 */
export function Lights({ lights }: LightsProps) {
  return (
    <>
      {lights.map((light, index) => {
        const key = `light-${index}`;

        switch (light.type) {
          case 'ambient':
            return (
              <ambientLight
                key={key}
                color={light.color}
                intensity={light.intensity ?? 1}
              />
            );

          case 'directional': {
            const position = light.position;
            return (
              <directionalLight
                key={key}
                color={light.color}
                intensity={light.intensity ?? 1}
                position={position}
                castShadow={light.castShadow ?? false}
                shadow-mapSize-width={light.shadowMapSize ?? 1024}
                shadow-mapSize-height={light.shadowMapSize ?? 1024}
                onUpdate={(self) => {
                  if (light.target) {
                    self.target.position.set(
                      light.target[0],
                      light.target[1],
                      light.target[2]
                    );
                  }
                }}
              />
            );
          }

          case 'point':
            return (
              <pointLight
                key={key}
                color={light.color}
                intensity={light.intensity ?? 1}
                position={light.position}
                distance={light.distance ?? 0}
                decay={light.decay ?? 2}
                castShadow={light.castShadow ?? false}
              />
            );

          case 'spot': {
            const position = light.position;
            return (
              <spotLight
                key={key}
                color={light.color}
                intensity={light.intensity ?? 1}
                position={position}
                distance={light.distance ?? 0}
                angle={light.angle ?? Math.PI / 3}
                penumbra={light.penumbra ?? 0}
                decay={light.decay ?? 2}
                castShadow={light.castShadow ?? false}
                onUpdate={(self) => {
                  if (light.target) {
                    self.target.position.set(
                      light.target[0],
                      light.target[1],
                      light.target[2]
                    );
                  }
                }}
              />
            );
          }

          case 'hemisphere':
            return (
              <hemisphereLight
                key={key}
                color={light.color}
                groundColor={light.groundColor}
                intensity={light.intensity ?? 1}
                position={light.position ?? [0, 1, 0]}
              />
            );

          default:
            console.warn(`Unknown light type: ${(light as ThreeLightConfig).type}`);
            return null;
        }
      })}
    </>
  );
}
