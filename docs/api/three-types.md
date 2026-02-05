# Three.js Types API Reference

Complete TypeScript type definitions for the Three.js layer.

## Core Types

### Vector3

3D vector represented as a tuple.

```typescript
type Vector3 = [number, number, number];
```

**Examples:**
```typescript
[0, 0, 0]      // Origin
[1, 2, 3]      // Position
[0.5, 1, 0.5]  // Scale
```

### Rotation3

3D rotation represented as Euler angles in radians.

```typescript
type Rotation3 = [number, number, number];
```

**Examples:**
```typescript
[0, 0, 0]                    // No rotation
[Math.PI / 2, 0, 0]         // 90° around X-axis
[0, Math.PI, 0]             // 180° around Y-axis
[0.1, 0.2, 0.3]             // Combined rotation
```

**Conversion:**
```typescript
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Usage:
const rotation: Rotation3 = [
  degreesToRadians(45),  // 45° around X
  degreesToRadians(90),  // 90° around Y
  degreesToRadians(0),   // 0° around Z
];
```

### Color

Color in hex string or numeric format.

```typescript
type Color = string | number;
```

**Examples:**
```typescript
"#ff0000"       // Red (hex string)
"#00ff00"       // Green (hex string)
0xff0000        // Red (numeric)
0x00ff00        // Green (numeric)
```

## Camera Types

### ThreeCameraConfig

Union of all camera types.

```typescript
type ThreeCameraConfig = PerspectiveCameraConfig | OrthographicCameraConfig;
```

### PerspectiveCameraConfig

Perspective camera with field of view.

```typescript
interface PerspectiveCameraConfig {
  type: 'perspective';
  /** Field of view in degrees (default: 75) */
  fov: number;
  /** Near clipping plane (default: 0.1) */
  near?: number;
  /** Far clipping plane (default: 1000) */
  far?: number;
  /** Camera position [x, y, z] (default: [0, 0, 5]) */
  position?: Vector3;
  /** Look at target [x, y, z] */
  lookAt?: Vector3;
}
```

**Example:**
```typescript
const camera: PerspectiveCameraConfig = {
  type: 'perspective',
  fov: 75,
  near: 0.1,
  far: 1000,
  position: [0, 5, 10],
  lookAt: [0, 0, 0],
};
```

### OrthographicCameraConfig

Orthographic camera without perspective distortion.

```typescript
interface OrthographicCameraConfig {
  type: 'orthographic';
  /** Left frustum plane */
  left?: number;
  /** Right frustum plane */
  right?: number;
  /** Top frustum plane */
  top?: number;
  /** Bottom frustum plane */
  bottom?: number;
  /** Near clipping plane (default: 0.1) */
  near?: number;
  /** Far clipping plane (default: 1000) */
  far?: number;
  /** Camera position [x, y, z] (default: [0, 0, 5]) */
  position?: Vector3;
  /** Look at target [x, y, z] */
  lookAt?: Vector3;
}
```

**Example:**
```typescript
const camera: OrthographicCameraConfig = {
  type: 'orthographic',
  left: -10,
  right: 10,
  top: 10,
  bottom: -10,
  position: [10, 10, 10],
  lookAt: [0, 0, 0],
};
```

## Light Types

### ThreeLightConfig

Union of all light types.

```typescript
type ThreeLightConfig =
  | AmbientLightConfig
  | DirectionalLightConfig
  | PointLightConfig
  | SpotLightConfig
  | HemisphereLightConfig;
```

### AmbientLightConfig

Uniform ambient lighting.

```typescript
interface AmbientLightConfig {
  type: 'ambient';
  /** Light color (default: '#ffffff') */
  color?: Color;
  /** Light intensity (default: 1) */
  intensity?: number;
}
```

### DirectionalLightConfig

Parallel directional lighting like sunlight.

```typescript
interface DirectionalLightConfig {
  type: 'directional';
  /** Light color (default: '#ffffff') */
  color?: Color;
  /** Light intensity (default: 1) */
  intensity?: number;
  /** Light position [x, y, z] */
  position: Vector3;
  /** Target position [x, y, z] */
  target?: Vector3;
  /** Enable shadows (default: false) */
  castShadow?: boolean;
  /** Shadow map size, power of 2 (default: 1024) */
  shadowMapSize?: number;
}
```

### PointLightConfig

Omnidirectional point light.

```typescript
interface PointLightConfig {
  type: 'point';
  /** Light color (default: '#ffffff') */
  color?: Color;
  /** Light intensity (default: 1) */
  intensity?: number;
  /** Light position [x, y, z] */
  position: Vector3;
  /** Maximum range (0 = infinite) (default: 0) */
  distance?: number;
  /** Light decay rate (default: 2) */
  decay?: number;
  /** Enable shadows (default: false) */
  castShadow?: boolean;
}
```

### SpotLightConfig

Cone-shaped spotlight.

```typescript
interface SpotLightConfig {
  type: 'spot';
  /** Light color (default: '#ffffff') */
  color?: Color;
  /** Light intensity (default: 1) */
  intensity?: number;
  /** Light position [x, y, z] */
  position: Vector3;
  /** Target position [x, y, z] */
  target?: Vector3;
  /** Maximum range (0 = infinite) (default: 0) */
  distance?: number;
  /** Angle of light cone in radians (default: π/3) */
  angle?: number;
  /** Penumbra softness 0-1 (default: 0) */
  penumbra?: number;
  /** Light decay rate (default: 2) */
  decay?: number;
  /** Enable shadows (default: false) */
  castShadow?: boolean;
}
```

### HemisphereLightConfig

Two-color hemisphere lighting.

```typescript
interface HemisphereLightConfig {
  type: 'hemisphere';
  /** Sky color (default: '#ffffff') */
  color?: Color;
  /** Ground color */
  groundColor?: Color;
  /** Light intensity (default: 1) */
  intensity?: number;
  /** Light position [x, y, z] (default: [0, 1, 0]) */
  position?: Vector3;
}
```

## Geometry Types

### ThreeGeometry

Union of all geometry types.

```typescript
type ThreeGeometry =
  | BoxGeometry
  | SphereGeometry
  | CylinderGeometry
  | ConeGeometry
  | TorusGeometry
  | PlaneGeometry
  | GLTFGeometry
  | Text3DGeometry;
```

### BoxGeometry

Rectangular cuboid geometry.

```typescript
interface BoxGeometry {
  type: 'box';
  /** Width (x-axis) (default: 1) */
  width?: number;
  /** Height (y-axis) (default: 1) */
  height?: number;
  /** Depth (z-axis) (default: 1) */
  depth?: number;
  /** Width segments (default: 1) */
  widthSegments?: number;
  /** Height segments (default: 1) */
  heightSegments?: number;
  /** Depth segments (default: 1) */
  depthSegments?: number;
}
```

### SphereGeometry

Spherical geometry.

```typescript
interface SphereGeometry {
  type: 'sphere';
  /** Sphere radius (default: 1) */
  radius?: number;
  /** Horizontal segments (default: 32) */
  widthSegments?: number;
  /** Vertical segments (default: 16) */
  heightSegments?: number;
  /** Horizontal starting angle (default: 0) */
  phiStart?: number;
  /** Horizontal sweep angle (default: 2π) */
  phiLength?: number;
  /** Vertical starting angle (default: 0) */
  thetaStart?: number;
  /** Vertical sweep angle (default: π) */
  thetaLength?: number;
}
```

### CylinderGeometry

Cylindrical geometry.

```typescript
interface CylinderGeometry {
  type: 'cylinder';
  /** Top radius (default: 1) */
  radiusTop?: number;
  /** Bottom radius (default: 1) */
  radiusBottom?: number;
  /** Height of cylinder (default: 1) */
  height?: number;
  /** Radial segments (default: 8) */
  radialSegments?: number;
  /** Height segments (default: 1) */
  heightSegments?: number;
  /** Open ended (default: false) */
  openEnded?: boolean;
}
```

### ConeGeometry

Conical geometry.

```typescript
interface ConeGeometry {
  type: 'cone';
  /** Base radius (default: 1) */
  radius?: number;
  /** Height of cone (default: 1) */
  height?: number;
  /** Radial segments (default: 8) */
  radialSegments?: number;
  /** Height segments (default: 1) */
  heightSegments?: number;
  /** Open ended (default: false) */
  openEnded?: boolean;
}
```

### TorusGeometry

Torus (donut) geometry.

```typescript
interface TorusGeometry {
  type: 'torus';
  /** Torus radius (default: 1) */
  radius?: number;
  /** Tube radius (default: 0.4) */
  tube?: number;
  /** Radial segments (default: 8) */
  radialSegments?: number;
  /** Tubular segments (default: 6) */
  tubularSegments?: number;
  /** Central angle (default: 2π) */
  arc?: number;
}
```

### PlaneGeometry

Flat plane geometry.

```typescript
interface PlaneGeometry {
  type: 'plane';
  /** Width (x-axis) (default: 1) */
  width?: number;
  /** Height (y-axis) (default: 1) */
  height?: number;
  /** Width segments (default: 1) */
  widthSegments?: number;
  /** Height segments (default: 1) */
  heightSegments?: number;
}
```

### GLTFGeometry

GLTF/GLB model loader.

```typescript
interface GLTFGeometry {
  type: 'gltf';
  /** URL or path to GLTF/GLB file */
  url: string;
  /** Auto-play animations (default: false) */
  autoPlay?: boolean;
  /** Animation index or name to play */
  animationIndex?: number | string;
  /** Animation playback speed (default: 1) */
  animationSpeed?: number;
  /** Scale model uniformly (default: 1) */
  scale?: number;
}
```

### Text3DGeometry

3D extruded text geometry.

```typescript
interface Text3DGeometry {
  type: 'text3d';
  /** Text content */
  text: string;
  /** Font URL (Three.js JSON format) */
  font: string;
  /** Font size (default: 1) */
  size?: number;
  /** Extrusion depth (default: 0.2) */
  height?: number;
  /** Curve segments (default: 12) */
  curveSegments?: number;
  /** Enable bevel (default: false) */
  bevelEnabled?: boolean;
  /** Bevel thickness (default: 0.03) */
  bevelThickness?: number;
  /** Bevel size (default: 0.02) */
  bevelSize?: number;
  /** Bevel segments (default: 3) */
  bevelSegments?: number;
}
```

## Material Types

### ThreeMaterialConfig

Union of all material types.

```typescript
type ThreeMaterialConfig =
  | StandardMaterialConfig
  | BasicMaterialConfig
  | PhongMaterialConfig
  | PhysicalMaterialConfig
  | NormalMaterialConfig
  | MatCapMaterialConfig;
```

### TextureConfig

Texture loading and configuration.

```typescript
interface TextureConfig {
  /** Texture URL */
  url: string;
  /** Texture wrapping mode S (default: 'repeat') */
  wrapS?: 'repeat' | 'clamp' | 'mirror';
  /** Texture wrapping mode T (default: 'repeat') */
  wrapT?: 'repeat' | 'clamp' | 'mirror';
  /** Repeat count [u, v] (default: [1, 1]) */
  repeat?: [number, number];
  /** Texture offset [u, v] (default: [0, 0]) */
  offset?: [number, number];
  /** Texture rotation in radians (default: 0) */
  rotation?: number;
}
```

### StandardMaterialConfig

Physically-based rendering (PBR) material with metalness/roughness workflow.

```typescript
interface StandardMaterialConfig {
  type: 'standard';
  /** Base color (default: '#ffffff') */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** Metalness 0-1 (default: 0) */
  metalness?: number;
  /** Roughness 0-1 (default: 1) */
  roughness?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale (default: [1, 1]) */
  normalScale?: [number, number];
  /** Roughness map */
  roughnessMap?: TextureConfig;
  /** Metalness map */
  metalnessMap?: TextureConfig;
  /** Ambient occlusion map */
  aoMap?: TextureConfig;
  /** AO intensity (default: 1) */
  aoMapIntensity?: number;
  /** Emissive color (default: '#000000') */
  emissive?: Color;
  /** Emissive intensity (default: 1) */
  emissiveIntensity?: number;
  /** Emissive map */
  emissiveMap?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Environment map intensity (default: 1) */
  envMapIntensity?: number;
}
```

### BasicMaterialConfig

Simple unlit material.

```typescript
interface BasicMaterialConfig {
  type: 'basic';
  /** Base color (default: '#ffffff') */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** Base color map */
  map?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Combine mode (default: 'multiply') */
  combine?: 'multiply' | 'mix' | 'add';
  /** Reflection amount (default: 1) */
  reflectivity?: number;
  /** Refraction ratio (default: 0.98) */
  refractionRatio?: number;
}
```

### PhongMaterialConfig

Classic Phong shading material.

```typescript
interface PhongMaterialConfig {
  type: 'phong';
  /** Base color (default: '#ffffff') */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** Specular color (default: '#111111') */
  specular?: Color;
  /** Shininess (default: 30) */
  shininess?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale (default: [1, 1]) */
  normalScale?: [number, number];
  /** Specular map */
  specularMap?: TextureConfig;
  /** Emissive color (default: '#000000') */
  emissive?: Color;
  /** Emissive map */
  emissiveMap?: TextureConfig;
}
```

### PhysicalMaterialConfig

Advanced PBR material with additional effects.

```typescript
interface PhysicalMaterialConfig {
  type: 'physical';
  /** Base color (default: '#ffffff') */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** Metalness 0-1 (default: 0) */
  metalness?: number;
  /** Roughness 0-1 (default: 1) */
  roughness?: number;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale (default: [1, 1]) */
  normalScale?: [number, number];
  /** Roughness map */
  roughnessMap?: TextureConfig;
  /** Metalness map */
  metalnessMap?: TextureConfig;
  /** Ambient occlusion map */
  aoMap?: TextureConfig;
  /** AO intensity (default: 1) */
  aoMapIntensity?: number;
  /** Emissive color (default: '#000000') */
  emissive?: Color;
  /** Emissive intensity (default: 1) */
  emissiveIntensity?: number;
  /** Emissive map */
  emissiveMap?: TextureConfig;
  /** Environment map */
  envMap?: TextureConfig;
  /** Environment map intensity (default: 1) */
  envMapIntensity?: number;
  /** Clearcoat intensity 0-1 (default: 0) */
  clearcoat?: number;
  /** Clearcoat roughness 0-1 (default: 0) */
  clearcoatRoughness?: number;
  /** Sheen effect 0-1 (default: 0) */
  sheen?: number;
  /** Sheen color (default: '#000000') */
  sheenColor?: Color;
  /** Transmission/glass effect 0-1 (default: 0) */
  transmission?: number;
  /** Volume thickness (default: 0) */
  thickness?: number;
}
```

### NormalMaterialConfig

Normal visualization material (debugging).

```typescript
interface NormalMaterialConfig {
  type: 'normal';
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale (default: [1, 1]) */
  normalScale?: [number, number];
}
```

### MatCapMaterialConfig

MatCap material with baked lighting.

```typescript
interface MatCapMaterialConfig {
  type: 'matcap';
  /** Base color (default: '#ffffff') */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Transparent rendering (default: false) */
  transparent?: boolean;
  /** Render side (default: 'front') */
  side?: 'front' | 'back' | 'double';
  /** Flat shading (default: false) */
  flatShading?: boolean;
  /** Wireframe mode (default: false) */
  wireframe?: boolean;
  /** MatCap texture (required) */
  matcap: TextureConfig;
  /** Base color map */
  map?: TextureConfig;
  /** Normal map */
  normalMap?: TextureConfig;
  /** Normal map scale (default: [1, 1]) */
  normalScale?: [number, number];
}
```

## Mesh Configuration

### ThreeMeshConfig

Complete mesh configuration with geometry, material, and transforms.

```typescript
interface ThreeMeshConfig {
  /** Unique mesh identifier */
  id: string;
  /** Display name */
  name?: string;
  /** Geometry configuration */
  geometry: ThreeGeometry;
  /** Material configuration */
  material: ThreeMaterialConfig;
  /** Position [x, y, z] (default: [0, 0, 0]) */
  position?: Vector3;
  /** Rotation [x, y, z] in radians (default: [0, 0, 0]) */
  rotation?: Rotation3;
  /** Scale [x, y, z] (default: [1, 1, 1]) */
  scale?: Vector3;
  /** Cast shadows (default: false) */
  castShadow?: boolean;
  /** Receive shadows (default: false) */
  receiveShadow?: boolean;
  /** Visible (default: true) */
  visible?: boolean;
  /** Render order (default: 0) */
  renderOrder?: number;
  /** Auto-rotation speed [x, y, z] per frame */
  autoRotate?: Vector3;
}
```

## Layer Configuration

### ThreeLayerProps

Props for the Three.js layer.

```typescript
interface ThreeLayerProps {
  /** Camera configuration */
  camera: ThreeCameraConfig;
  /** Array of lights in the scene (default: []) */
  lights?: ThreeLightConfig[];
  /** Array of meshes to render */
  meshes: ThreeMeshConfig[];
  /** Background color or texture */
  background?: Color | TextureConfig;
  /** Fog configuration */
  fog?: {
    color: Color;
    near: number;
    far: number;
  };
  /** Enable anti-aliasing (default: true) */
  antialias?: boolean;
  /** Shadow configuration */
  shadows?: {
    enabled: boolean;
    type?: 'basic' | 'pcf' | 'pcfsoft' | 'vsm';
  };
  /** Tone mapping configuration */
  toneMapping?: {
    type: 'none' | 'linear' | 'reinhard' | 'cineon' | 'aces';
    exposure?: number;
  };
  /** Enable orbit controls for preview (default: false) */
  controls?: boolean;
  /** Custom shader code (GLSL) */
  customShader?: {
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: Record<string, unknown>;
  };
}
```

### ThreeLayer

Complete Three.js layer definition.

```typescript
interface ThreeLayer extends LayerBase {
  type: 'three';
  props: ThreeLayerProps;
}
```

## Usage Examples

### Basic Scene

```typescript
import type { ThreeLayer } from '@rendervid/core';

const layer: ThreeLayer = {
  id: 'my-scene',
  type: 'three',
  position: { x: 0, y: 0 },
  size: { width: 1920, height: 1080 },
  props: {
    camera: {
      type: 'perspective',
      fov: 75,
      position: [0, 0, 5],
    },
    lights: [
      { type: 'ambient', intensity: 0.5 },
      { type: 'directional', position: [5, 5, 5], intensity: 1 },
    ],
    meshes: [
      {
        id: 'box-1',
        geometry: { type: 'box', width: 2, height: 2, depth: 2 },
        material: { type: 'standard', color: '#ff6b6b', metalness: 0.3, roughness: 0.4 },
        autoRotate: [0.01, 0.02, 0],
      },
    ],
  },
};
```

### Product Showcase

```typescript
const productScene: ThreeLayer = {
  id: 'product',
  type: 'three',
  position: { x: 0, y: 0 },
  size: { width: 1920, height: 1080 },
  props: {
    camera: {
      type: 'perspective',
      fov: 50,
      position: [0, 2, 8],
      lookAt: [0, 0, 0],
    },
    lights: [
      {
        type: 'directional',
        position: [10, 10, 5],
        intensity: 1,
        castShadow: true,
        shadowMapSize: 2048,
      },
      {
        type: 'hemisphere',
        color: '#ffffff',
        groundColor: '#444444',
        intensity: 0.5,
      },
    ],
    meshes: [
      {
        id: 'product',
        geometry: {
          type: 'gltf',
          url: './assets/product.glb',
          scale: 1,
        },
        material: {
          type: 'physical',
          color: '#ffffff',
          metalness: 0.9,
          roughness: 0.1,
          clearcoat: 1,
          clearcoatRoughness: 0,
        },
        castShadow: true,
        receiveShadow: true,
        autoRotate: [0, 0.01, 0],
      },
      {
        id: 'floor',
        geometry: {
          type: 'plane',
          width: 20,
          height: 20,
        },
        material: {
          type: 'standard',
          color: '#cccccc',
          roughness: 0.8,
        },
        position: [0, -2, 0],
        rotation: [-Math.PI / 2, 0, 0],
        receiveShadow: true,
      },
    ],
    shadows: {
      enabled: true,
      type: 'pcfsoft',
    },
    toneMapping: {
      type: 'aces',
      exposure: 1,
    },
    background: '#f0f0f0',
  },
};
```

### 3D Text

```typescript
const textScene: ThreeLayer = {
  id: 'text-3d',
  type: 'three',
  position: { x: 0, y: 0 },
  size: { width: 1920, height: 1080 },
  props: {
    camera: {
      type: 'perspective',
      fov: 75,
      position: [0, 0, 10],
    },
    lights: [
      {
        type: 'directional',
        position: [5, 5, 5],
        intensity: 1,
      },
      {
        type: 'ambient',
        intensity: 0.3,
      },
    ],
    meshes: [
      {
        id: 'text',
        geometry: {
          type: 'text3d',
          text: 'RenderVid',
          font: 'https://example.com/helvetiker_bold.json',
          size: 2,
          height: 0.5,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.05,
        },
        material: {
          type: 'physical',
          color: '#4c00ff',
          metalness: 0.8,
          roughness: 0.2,
          emissive: '#4c00ff',
          emissiveIntensity: 0.2,
        },
        position: [-5, 0, 0],
      },
    ],
    background: '#000000',
  },
};
```

## See Also

- [Three.js Layer Guide](/docs/layers/three-layer.md)
- [Layer Types](/docs/features/layer-types.md)
- [Examples](/examples/3d/)
