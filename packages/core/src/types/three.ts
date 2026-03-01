/**
 * Three.js 3D layer types.
 * Provides comprehensive type definitions for 3D scenes, cameras, lights, geometry, and materials.
 */

import type { LayerBase } from './layer';

/**
 * 3D Vector represented as a tuple [x, y, z].
 */
export type Vector3 = [number, number, number];

/**
 * 3D Rotation represented as Euler angles [x, y, z] in radians.
 */
export type Rotation3 = [number, number, number];

/**
 * Color in hex format (e.g., '#ffffff') or numeric (0xffffff).
 */
export type Color = string | number;

// ═══════════════════════════════════════════════════════════════
// CAMERA CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * Camera type discriminator.
 */
export type CameraType = 'perspective' | 'orthographic';

/**
 * Perspective camera configuration.
 */
export interface PerspectiveCameraConfig {
  type: 'perspective';
  /** Field of view in degrees */
  fov: number;
  /** Near clipping plane */
  near?: number;
  /** Far clipping plane */
  far?: number;
  /** Camera position [x, y, z] */
  position?: Vector3;
  /** Look at target [x, y, z] */
  lookAt?: Vector3;
}

/**
 * Orthographic camera configuration.
 */
export interface OrthographicCameraConfig {
  type: 'orthographic';
  /** Left frustum plane */
  left?: number;
  /** Right frustum plane */
  right?: number;
  /** Top frustum plane */
  top?: number;
  /** Bottom frustum plane */
  bottom?: number;
  /** Near clipping plane */
  near?: number;
  /** Far clipping plane */
  far?: number;
  /** Camera position [x, y, z] */
  position?: Vector3;
  /** Look at target [x, y, z] */
  lookAt?: Vector3;
}

/**
 * Camera configuration union.
 */
export type ThreeCameraConfig = PerspectiveCameraConfig | OrthographicCameraConfig;

// ═══════════════════════════════════════════════════════════════
// LIGHT CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * Light type discriminator.
 */
export type LightType = 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';

/**
 * Base light properties.
 */
interface LightBase {
  /** Light color */
  color?: Color;
  /** Light intensity */
  intensity?: number;
}

/**
 * Ambient light configuration.
 * Globally illuminates all objects in the scene equally.
 */
export interface AmbientLightConfig extends LightBase {
  type: 'ambient';
}

/**
 * Directional light configuration.
 * Light rays are parallel (like sunlight).
 */
export interface DirectionalLightConfig extends LightBase {
  type: 'directional';
  /** Light position [x, y, z] */
  position: Vector3;
  /** Target position [x, y, z] */
  target?: Vector3;
  /** Enable shadows */
  castShadow?: boolean;
  /** Shadow map size (power of 2) */
  shadowMapSize?: number;
}

/**
 * Point light configuration.
 * Light emanates from a single point in all directions.
 */
export interface PointLightConfig extends LightBase {
  type: 'point';
  /** Light position [x, y, z] */
  position: Vector3;
  /** Maximum range of light (0 = infinite) */
  distance?: number;
  /** Light decay rate */
  decay?: number;
  /** Enable shadows */
  castShadow?: boolean;
}

/**
 * Spot light configuration.
 * Cone-shaped light emanating from a single point.
 */
export interface SpotLightConfig extends LightBase {
  type: 'spot';
  /** Light position [x, y, z] */
  position: Vector3;
  /** Target position [x, y, z] */
  target?: Vector3;
  /** Maximum range of light (0 = infinite) */
  distance?: number;
  /** Angle of light cone in radians */
  angle?: number;
  /** Penumbra softness (0-1) */
  penumbra?: number;
  /** Light decay rate */
  decay?: number;
  /** Enable shadows */
  castShadow?: boolean;
}

/**
 * Hemisphere light configuration.
 * Light above ground and light from below ground.
 */
export interface HemisphereLightConfig extends LightBase {
  type: 'hemisphere';
  /** Ground color */
  groundColor?: Color;
  /** Light position [x, y, z] */
  position?: Vector3;
}

/**
 * Light configuration union.
 */
export type ThreeLightConfig =
  | AmbientLightConfig
  | DirectionalLightConfig
  | PointLightConfig
  | SpotLightConfig
  | HemisphereLightConfig;

// ═══════════════════════════════════════════════════════════════
// GEOMETRY CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * Geometry type discriminator.
 */
export type GeometryType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'gltf' | 'text3d';

/**
 * Box geometry configuration.
 */
export interface BoxGeometry {
  type: 'box';
  /** Width (x-axis) */
  width?: number;
  /** Height (y-axis) */
  height?: number;
  /** Depth (z-axis) */
  depth?: number;
  /** Width segments */
  widthSegments?: number;
  /** Height segments */
  heightSegments?: number;
  /** Depth segments */
  depthSegments?: number;
}

/**
 * Sphere geometry configuration.
 */
export interface SphereGeometry {
  type: 'sphere';
  /** Sphere radius */
  radius?: number;
  /** Horizontal segments */
  widthSegments?: number;
  /** Vertical segments */
  heightSegments?: number;
  /** Horizontal starting angle */
  phiStart?: number;
  /** Horizontal sweep angle */
  phiLength?: number;
  /** Vertical starting angle */
  thetaStart?: number;
  /** Vertical sweep angle */
  thetaLength?: number;
}

/**
 * Cylinder geometry configuration.
 */
export interface CylinderGeometry {
  type: 'cylinder';
  /** Top radius */
  radiusTop?: number;
  /** Bottom radius */
  radiusBottom?: number;
  /** Height of cylinder */
  height?: number;
  /** Radial segments */
  radialSegments?: number;
  /** Height segments */
  heightSegments?: number;
  /** Open ended */
  openEnded?: boolean;
}

/**
 * Cone geometry configuration.
 */
export interface ConeGeometry {
  type: 'cone';
  /** Base radius */
  radius?: number;
  /** Height of cone */
  height?: number;
  /** Radial segments */
  radialSegments?: number;
  /** Height segments */
  heightSegments?: number;
  /** Open ended */
  openEnded?: boolean;
}

/**
 * Torus geometry configuration.
 */
export interface TorusGeometry {
  type: 'torus';
  /** Torus radius */
  radius?: number;
  /** Tube radius */
  tube?: number;
  /** Radial segments */
  radialSegments?: number;
  /** Tubular segments */
  tubularSegments?: number;
  /** Central angle */
  arc?: number;
}

/**
 * Plane geometry configuration.
 */
export interface PlaneGeometry {
  type: 'plane';
  /** Width (x-axis) */
  width?: number;
  /** Height (y-axis) */
  height?: number;
  /** Width segments */
  widthSegments?: number;
  /** Height segments */
  heightSegments?: number;
}

/**
 * GLTF model geometry configuration.
 */
export interface GLTFGeometry {
  type: 'gltf';
  /** URL or path to GLTF/GLB file */
  url: string;
  /** Auto-play animations */
  autoPlay?: boolean;
  /** Animation index or name to play */
  animationIndex?: number | string;
  /** Animation playback speed */
  animationSpeed?: number;
  /** Scale model uniformly */
  scale?: number;
}

/**
 * 3D Text geometry configuration.
 */
export interface Text3DGeometry {
  type: 'text3d';
  /** Text content */
  text: string;
  /** Font URL (JSON format) */
  font: string;
  /** Font size */
  size?: number;
  /** Extrusion depth */
  height?: number;
  /** Curve segments */
  curveSegments?: number;
  /** Enable bevel */
  bevelEnabled?: boolean;
  /** Bevel thickness */
  bevelThickness?: number;
  /** Bevel size */
  bevelSize?: number;
  /** Bevel segments */
  bevelSegments?: number;
}

/**
 * Geometry configuration union.
 */
export type ThreeGeometry =
  | BoxGeometry
  | SphereGeometry
  | CylinderGeometry
  | ConeGeometry
  | TorusGeometry
  | PlaneGeometry
  | GLTFGeometry
  | Text3DGeometry;

// ═══════════════════════════════════════════════════════════════
// MATERIAL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * Material type discriminator.
 */
export type MaterialType = 'standard' | 'basic' | 'phong' | 'physical' | 'normal' | 'matcap';

/**
 * Texture configuration.
 */
export interface TextureConfig {
  /** Texture URL */
  url: string;
  /** Texture wrapping mode */
  wrapS?: 'repeat' | 'clamp' | 'mirror';
  /** Texture wrapping mode */
  wrapT?: 'repeat' | 'clamp' | 'mirror';
  /** Repeat count [u, v] */
  repeat?: [number, number];
  /** Texture offset [u, v] */
  offset?: [number, number];
  /** Texture rotation in radians */
  rotation?: number;
}

/**
 * Base material properties.
 */
interface MaterialBase {
  /** Base color */
  color?: Color;
  /** Opacity (0-1) */
  opacity?: number;
  /** Transparent rendering */
  transparent?: boolean;
  /** Render side */
  side?: 'front' | 'back' | 'double';
  /** Flat shading */
  flatShading?: boolean;
  /** Wireframe mode */
  wireframe?: boolean;
}

/**
 * Standard PBR material configuration.
 * Physically-based rendering with metalness and roughness.
 */
export interface StandardMaterialConfig extends MaterialBase {
  type: 'standard';
  /** Metalness (0-1) */
  metalness?: number;
  /** Roughness (0-1) */
  roughness?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale */
  normalScale?: [number, number];
  /** Roughness map */
  roughnessMap?: TextureConfig;
  /** Metalness map */
  metalnessMap?: TextureConfig;
  /** Ambient occlusion map */
  aoMap?: TextureConfig;
  /** AO intensity */
  aoMapIntensity?: number;
  /** Emissive color */
  emissive?: Color;
  /** Emissive intensity */
  emissiveIntensity?: number;
  /** Emissive map */
  emissiveMap?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Environment map intensity */
  envMapIntensity?: number;
}

/**
 * Basic material configuration.
 * Simple unlit material.
 */
export interface BasicMaterialConfig extends MaterialBase {
  type: 'basic';
  /** Base color map */
  map?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Combine environment map */
  combine?: 'multiply' | 'mix' | 'add';
  /** Reflection amount */
  reflectivity?: number;
  /** Refraction ratio */
  refractionRatio?: number;
}

/**
 * Phong material configuration.
 * Classic Phong shading model.
 */
export interface PhongMaterialConfig extends MaterialBase {
  type: 'phong';
  /** Specular color */
  specular?: Color;
  /** Shininess */
  shininess?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale */
  normalScale?: [number, number];
  /** Specular map */
  specularMap?: TextureConfig;
  /** Emissive color */
  emissive?: Color;
  /** Emissive map */
  emissiveMap?: TextureConfig;
}

/**
 * Physical material configuration.
 * Advanced PBR material.
 */
export interface PhysicalMaterialConfig extends MaterialBase {
  type: 'physical';
  /** Metalness (0-1) */
  metalness?: number;
  /** Roughness (0-1) */
  roughness?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale */
  normalScale?: [number, number];
  /** Roughness map */
  roughnessMap?: TextureConfig;
  /** Metalness map */
  metalnessMap?: TextureConfig;
  /** Ambient occlusion map */
  aoMap?: TextureConfig;
  /** AO intensity */
  aoMapIntensity?: number;
  /** Emissive color */
  emissive?: Color;
  /** Emissive intensity */
  emissiveIntensity?: number;
  /** Emissive map */
  emissiveMap?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Environment map intensity */
  envMapIntensity?: number;
  /** Clearcoat intensity */
  clearcoat?: number;
  /** Clearcoat roughness */
  clearcoatRoughness?: number;
  /** Sheen effect */
  sheen?: number;
  /** Sheen color */
  sheenColor?: Color;
  /** Transmission (glass effect) */
  transmission?: number;
  /** Thickness for volume rendering */
  thickness?: number;
}

/**
 * Normal material configuration.
 * Displays surface normals as RGB colors.
 */
export interface NormalMaterialConfig extends MaterialBase {
  type: 'normal';
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale */
  normalScale?: [number, number];
}

/**
 * MatCap material configuration.
 * Material capture for spherical environment mapping.
 */
export interface MatCapMaterialConfig extends MaterialBase {
  type: 'matcap';
  /** MatCap texture */
  matcap: TextureConfig;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale */
  normalScale?: [number, number];
}

/**
 * Material configuration union.
 */
export type ThreeMaterialConfig =
  | StandardMaterialConfig
  | BasicMaterialConfig
  | PhongMaterialConfig
  | PhysicalMaterialConfig
  | NormalMaterialConfig
  | MatCapMaterialConfig;

// ═══════════════════════════════════════════════════════════════
// MESH CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * 3D Mesh configuration.
 */
export interface ThreeMeshConfig {
  /** Unique mesh identifier */
  id: string;
  /** Display name */
  name?: string;
  /** Geometry configuration */
  geometry: ThreeGeometry;
  /** Material configuration */
  material: ThreeMaterialConfig;
  /** Position [x, y, z] */
  position?: Vector3;
  /** Rotation [x, y, z] in radians */
  rotation?: Rotation3;
  /** Scale [x, y, z] */
  scale?: Vector3;
  /** Cast shadows */
  castShadow?: boolean;
  /** Receive shadows */
  receiveShadow?: boolean;
  /** Visible */
  visible?: boolean;
  /** Render order */
  renderOrder?: number;
  /** Auto-rotation speed [x, y, z] per frame */
  autoRotate?: Vector3;
  /** Physics rigid body configuration */
  rigidBody?: {
    type: 'dynamic' | 'static' | 'kinematic';
    mass?: number;
    linearVelocity?: Vector3;
    angularVelocity?: Vector3;
    linearDamping?: number;
    angularDamping?: number;
    gravityScale?: number;
    friction?: number;
    restitution?: number;
  };
  /** Physics collider configuration */
  collider?: {
    type: 'cuboid' | 'sphere' | 'capsule';
    halfExtents?: Vector3;
    radius?: number;
    halfHeight?: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// THREE LAYER PROPS
// ═══════════════════════════════════════════════════════════════

/**
 * Props for Three.js 3D scene layer.
 */
export interface ThreeLayerProps {
  /**
   * Camera configuration.
   * @default { type: 'perspective', fov: 75, position: [0, 0, 5] }
   */
  camera: ThreeCameraConfig;

  /**
   * Array of lights in the scene.
   * @default [{ type: 'ambient', color: '#ffffff', intensity: 0.5 }]
   */
  lights?: ThreeLightConfig[];

  /**
   * Array of meshes to render.
   */
  meshes: ThreeMeshConfig[];

  /**
   * Background color or texture.
   */
  background?: Color | TextureConfig;

  /**
   * Enable fog effect.
   */
  fog?: {
    /** Fog color */
    color: Color;
    /** Fog near distance */
    near: number;
    /** Fog far distance */
    far: number;
  };

  /**
   * Enable anti-aliasing.
   * @default true
   */
  antialias?: boolean;

  /**
   * Shadow map configuration.
   */
  shadows?: {
    /** Enable shadows */
    enabled: boolean;
    /** Shadow map type */
    type?: 'basic' | 'pcf' | 'pcfsoft' | 'vsm';
  };

  /**
   * Tone mapping configuration.
   */
  toneMapping?: {
    /** Tone mapping type */
    type: 'none' | 'linear' | 'reinhard' | 'cineon' | 'aces';
    /** Exposure level */
    exposure?: number;
  };

  /**
   * Enable orbit controls (for preview).
   * @default false
   */
  controls?: boolean;

  /**
   * Custom shader code (GLSL).
   */
  customShader?: {
    /** Vertex shader */
    vertexShader?: string;
    /** Fragment shader */
    fragmentShader?: string;
    /** Uniform values */
    uniforms?: Record<string, unknown>;
  };

  /**
   * Physics world configuration.
   */
  physics?: {
    /** Enable physics simulation */
    enabled: boolean;
    /** Gravity vector [x, y, z] */
    gravity?: Vector3;
    /** Fixed timestep for physics simulation */
    timestep?: number;
    /** Show debug visualization */
    debug?: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════
// THREE LAYER
// ═══════════════════════════════════════════════════════════════

/**
 * Three.js 3D scene layer.
 *
 * @example Basic 3D scene with rotating cube:
 * ```typescript
 * const threeLayer: ThreeLayer = {
 *   id: 'scene-1',
 *   type: 'three',
 *   position: { x: 0, y: 0 },
 *   size: { width: 1920, height: 1080 },
 *   props: {
 *     camera: {
 *       type: 'perspective',
 *       fov: 75,
 *       position: [0, 0, 5],
 *     },
 *     lights: [
 *       { type: 'ambient', intensity: 0.5 },
 *       { type: 'directional', position: [5, 5, 5], intensity: 1 },
 *     ],
 *     meshes: [
 *       {
 *         id: 'cube-1',
 *         geometry: { type: 'box', width: 1, height: 1, depth: 1 },
 *         material: { type: 'standard', color: '#ff0000', metalness: 0.5, roughness: 0.5 },
 *         autoRotate: [0.01, 0.01, 0],
 *       },
 *     ],
 *   },
 * };
 * ```
 */
export interface ThreeLayer extends LayerBase {
  type: 'three';
  props: ThreeLayerProps;
}
