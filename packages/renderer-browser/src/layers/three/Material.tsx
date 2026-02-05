import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThreeMaterialConfig, TextureConfig } from '@rendervid/core';

export interface MaterialProps {
  config: ThreeMaterialConfig;
}

/**
 * Material component supporting all material types.
 * Handles PBR materials, basic materials, and texture loading.
 */
export function Material({ config }: MaterialProps) {
  switch (config.type) {
    case 'standard':
      return <StandardMaterial config={config} />;

    case 'basic':
      return <BasicMaterial config={config} />;

    case 'phong':
      return <PhongMaterial config={config} />;

    case 'physical':
      return <PhysicalMaterial config={config} />;

    case 'normal':
      return <NormalMaterial config={config} />;

    case 'matcap':
      return <MatCapMaterial config={config} />;

    default:
      console.warn(`Unknown material type: ${(config as ThreeMaterialConfig).type}`);
      return <meshStandardMaterial />;
  }
}

/**
 * Standard PBR material.
 */
function StandardMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'standard' }>;
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const roughnessMap = useTextureIfDefined(config.roughnessMap);
  const metalnessMap = useTextureIfDefined(config.metalnessMap);
  const aoMap = useTextureIfDefined(config.aoMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);
  const envMap = useTextureIfDefined(config.envMap);

  return (
    <meshStandardMaterial
      color={config.color}
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      metalness={config.metalness ?? 0}
      roughness={config.roughness ?? 1}
      map={map}
      normalMap={normalMap}
      normalScale={config.normalScale ? new THREE.Vector2(...config.normalScale) : undefined}
      roughnessMap={roughnessMap}
      metalnessMap={metalnessMap}
      aoMap={aoMap}
      aoMapIntensity={config.aoMapIntensity}
      emissive={config.emissive}
      emissiveIntensity={config.emissiveIntensity}
      emissiveMap={emissiveMap}
      envMap={envMap}
      envMapIntensity={config.envMapIntensity}
    />
  );
}

/**
 * Basic unlit material.
 */
function BasicMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'basic' }>;
}) {
  const map = useTextureIfDefined(config.map);
  const envMap = useTextureIfDefined(config.envMap);

  return (
    <meshBasicMaterial
      color={config.color}
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      map={map}
      envMap={envMap}
      reflectivity={config.reflectivity}
      refractionRatio={config.refractionRatio}
    />
  );
}

/**
 * Phong shading material.
 */
function PhongMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'phong' }>;
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const specularMap = useTextureIfDefined(config.specularMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);

  return (
    <meshPhongMaterial
      color={config.color}
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      specular={config.specular}
      shininess={config.shininess ?? 30}
      map={map}
      normalMap={normalMap}
      normalScale={config.normalScale ? new THREE.Vector2(...config.normalScale) : undefined}
      specularMap={specularMap}
      emissive={config.emissive}
      emissiveMap={emissiveMap}
    />
  );
}

/**
 * Physical PBR material.
 */
function PhysicalMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'physical' }>;
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const roughnessMap = useTextureIfDefined(config.roughnessMap);
  const metalnessMap = useTextureIfDefined(config.metalnessMap);
  const aoMap = useTextureIfDefined(config.aoMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);
  const envMap = useTextureIfDefined(config.envMap);

  return (
    <meshPhysicalMaterial
      color={config.color}
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      metalness={config.metalness ?? 0}
      roughness={config.roughness ?? 1}
      map={map}
      normalMap={normalMap}
      normalScale={config.normalScale ? new THREE.Vector2(...config.normalScale) : undefined}
      roughnessMap={roughnessMap}
      metalnessMap={metalnessMap}
      aoMap={aoMap}
      aoMapIntensity={config.aoMapIntensity}
      emissive={config.emissive}
      emissiveIntensity={config.emissiveIntensity}
      emissiveMap={emissiveMap}
      envMap={envMap}
      envMapIntensity={config.envMapIntensity}
      clearcoat={config.clearcoat}
      clearcoatRoughness={config.clearcoatRoughness}
      sheen={config.sheen}
      sheenColor={config.sheenColor}
      transmission={config.transmission}
      thickness={config.thickness}
    />
  );
}

/**
 * Normal material (displays normals as colors).
 */
function NormalMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'normal' }>;
}) {
  const normalMap = useTextureIfDefined(config.normalMap);

  return (
    <meshNormalMaterial
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      normalMap={normalMap}
      normalScale={config.normalScale ? new THREE.Vector2(...config.normalScale) : undefined}
    />
  );
}

/**
 * MatCap material.
 */
function MatCapMaterial({
  config,
}: {
  config: Extract<ThreeMaterialConfig, { type: 'matcap' }>;
}) {
  const matcap = useTexture(config.matcap);
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);

  return (
    <meshMatcapMaterial
      color={config.color}
      opacity={config.opacity ?? 1}
      transparent={config.transparent ?? (config.opacity !== undefined && config.opacity < 1)}
      side={getSide(config.side)}
      flatShading={config.flatShading}
      wireframe={config.wireframe}
      matcap={matcap}
      map={map}
      normalMap={normalMap}
      normalScale={config.normalScale ? new THREE.Vector2(...config.normalScale) : undefined}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Load texture from configuration.
 */
function useTexture(config: TextureConfig): THREE.Texture {
  const texture = useLoader(THREE.TextureLoader, config.url);

  useMemo(() => {
    if (!texture) return;

    // Set wrapping mode
    if (config.wrapS) {
      texture.wrapS = getWrapMode(config.wrapS);
    }
    if (config.wrapT) {
      texture.wrapT = getWrapMode(config.wrapT);
    }

    // Set repeat
    if (config.repeat) {
      texture.repeat.set(config.repeat[0], config.repeat[1]);
    }

    // Set offset
    if (config.offset) {
      texture.offset.set(config.offset[0], config.offset[1]);
    }

    // Set rotation
    if (config.rotation !== undefined) {
      texture.rotation = config.rotation;
    }

    texture.needsUpdate = true;
  }, [texture, config]);

  return texture;
}

/**
 * Load texture if configuration is provided.
 */
function useTextureIfDefined(config?: TextureConfig): THREE.Texture | undefined {
  const shouldLoad = !!config;
  const texture = shouldLoad ? useLoader(THREE.TextureLoader, config.url) : undefined;

  useMemo(() => {
    if (!texture || !config) return;

    // Set wrapping mode
    if (config.wrapS) {
      texture.wrapS = getWrapMode(config.wrapS);
    }
    if (config.wrapT) {
      texture.wrapT = getWrapMode(config.wrapT);
    }

    // Set repeat
    if (config.repeat) {
      texture.repeat.set(config.repeat[0], config.repeat[1]);
    }

    // Set offset
    if (config.offset) {
      texture.offset.set(config.offset[0], config.offset[1]);
    }

    // Set rotation
    if (config.rotation !== undefined) {
      texture.rotation = config.rotation;
    }

    texture.needsUpdate = true;
  }, [texture, config]);

  return texture;
}

/**
 * Convert side string to Three.js constant.
 */
function getSide(side?: 'front' | 'back' | 'double'): THREE.Side {
  switch (side) {
    case 'front':
      return THREE.FrontSide;
    case 'back':
      return THREE.BackSide;
    case 'double':
      return THREE.DoubleSide;
    default:
      return THREE.FrontSide;
  }
}

/**
 * Convert wrap mode string to Three.js constant.
 */
function getWrapMode(mode: 'repeat' | 'clamp' | 'mirror'): THREE.Wrapping {
  switch (mode) {
    case 'repeat':
      return THREE.RepeatWrapping;
    case 'clamp':
      return THREE.ClampToEdgeWrapping;
    case 'mirror':
      return THREE.MirroredRepeatWrapping;
    default:
      return THREE.RepeatWrapping;
  }
}
