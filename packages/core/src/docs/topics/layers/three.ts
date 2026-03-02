import type { DocResult } from '../../types.js';

export function getThreeLayerDocs(): DocResult {
  return {
    topic: 'layer/three',
    title: 'Three.js 3D Layer',
    description: 'Full 3D scenes with cameras, lights, meshes, materials, textures, and shaders powered by Three.js.',
    properties: {
      camera: { type: 'ThreeCameraConfig', required: true, description: 'Camera configuration (perspective or orthographic)' },
      lights: { type: 'ThreeLightConfig[]', description: 'Array of lights in the scene' },
      meshes: { type: 'ThreeMeshConfig[]', required: true, description: 'Array of 3D meshes to render' },
      background: { type: 'Color | TextureConfig', description: 'Scene background color or texture' },
      fog: { type: '{ color, near, far }', description: 'Fog effect' },
      antialias: { type: 'boolean', description: 'Enable anti-aliasing', default: true },
      shadows: { type: '{ enabled, type? }', description: 'Shadow map configuration' },
      toneMapping: { type: '{ type, exposure? }', description: 'Tone mapping for HDR rendering' },
      controls: { type: 'boolean', description: 'Enable orbit controls (preview only)', default: false },
      customShader: { type: '{ vertexShader?, fragmentShader?, uniforms? }', description: 'Custom GLSL shader code' },
    },
    sections: [
      {
        title: 'Camera Types',
        description: 'Two camera types available',
        properties: {
          'perspective.fov': { type: 'number', required: true, description: 'Field of view in degrees', example: 75 },
          'perspective.near': { type: 'number', description: 'Near clipping plane', default: 0.1 },
          'perspective.far': { type: 'number', description: 'Far clipping plane', default: 1000 },
          'perspective.position': { type: '[x, y, z]', description: 'Camera position', example: [0, 0, 5] },
          'perspective.lookAt': { type: '[x, y, z]', description: 'Look-at target', example: [0, 0, 0] },
          'orthographic.left/right/top/bottom': { type: 'number', description: 'Frustum planes' },
        },
      },
      {
        title: 'Light Types',
        description: '5 light types: ambient, directional, point, spot, hemisphere',
        properties: {
          'ambient': { type: 'AmbientLightConfig', description: 'Global illumination. Props: color, intensity' },
          'directional': { type: 'DirectionalLightConfig', description: 'Parallel rays (sunlight). Props: position, target, castShadow' },
          'point': { type: 'PointLightConfig', description: 'Omnidirectional from a point. Props: position, distance, decay' },
          'spot': { type: 'SpotLightConfig', description: 'Cone-shaped. Props: position, target, angle, penumbra' },
          'hemisphere': { type: 'HemisphereLightConfig', description: 'Sky + ground colors. Props: groundColor' },
        },
      },
      {
        title: 'Geometry Types',
        description: '8 geometry types for meshes',
        properties: {
          box: { type: 'BoxGeometry', description: 'Box/cube. Props: width, height, depth' },
          sphere: { type: 'SphereGeometry', description: 'Sphere. Props: radius, widthSegments, heightSegments' },
          cylinder: { type: 'CylinderGeometry', description: 'Cylinder. Props: radiusTop, radiusBottom, height' },
          cone: { type: 'ConeGeometry', description: 'Cone. Props: radius, height' },
          torus: { type: 'TorusGeometry', description: 'Donut/torus. Props: radius, tube' },
          plane: { type: 'PlaneGeometry', description: 'Flat plane. Props: width, height' },
          gltf: { type: 'GLTFGeometry', description: '3D model from GLTF/GLB file. Props: url, autoPlay, animationSpeed' },
          text3d: { type: 'Text3DGeometry', description: 'Extruded 3D text. Props: text, font (URL), size, height, bevel' },
        },
      },
      {
        title: 'Material Types',
        description: '6 material types for mesh surfaces',
        properties: {
          standard: { type: 'StandardMaterialConfig', description: 'PBR material. Props: metalness, roughness, map, normalMap, emissive' },
          basic: { type: 'BasicMaterialConfig', description: 'Unlit material. Props: map, envMap' },
          phong: { type: 'PhongMaterialConfig', description: 'Classic Phong shading. Props: specular, shininess' },
          physical: { type: 'PhysicalMaterialConfig', description: 'Advanced PBR. Props: clearcoat, sheen, transmission, thickness' },
          normal: { type: 'NormalMaterialConfig', description: 'Display surface normals as RGB' },
          matcap: { type: 'MatCapMaterialConfig', description: 'Material capture. Props: matcap (texture)' },
        },
      },
      {
        title: 'Mesh Configuration',
        description: 'Each mesh combines geometry + material + transform',
        properties: {
          id: { type: 'string', required: true, description: 'Unique mesh identifier' },
          geometry: { type: 'ThreeGeometry', required: true, description: 'Geometry configuration' },
          material: { type: 'ThreeMaterialConfig', required: true, description: 'Material configuration' },
          position: { type: '[x, y, z]', description: 'Mesh position', default: [0, 0, 0] },
          rotation: { type: '[x, y, z]', description: 'Euler rotation in radians' },
          scale: { type: '[x, y, z]', description: 'Scale', default: [1, 1, 1] },
          castShadow: { type: 'boolean', description: 'Cast shadows', default: false },
          receiveShadow: { type: 'boolean', description: 'Receive shadows', default: false },
          autoRotate: { type: '[x, y, z]', description: 'Auto-rotation speed per frame', example: [0.01, 0.01, 0] },
        },
      },
    ],
    examples: [
      {
        description: 'Rotating cube with lighting',
        layer: {
          id: '3d-scene', type: 'three',
          position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
          props: {
            camera: { type: 'perspective', fov: 75, position: [0, 0, 5] },
            lights: [
              { type: 'ambient', intensity: 0.5 },
              { type: 'directional', position: [5, 5, 5], intensity: 1 },
            ],
            meshes: [{
              id: 'cube', geometry: { type: 'box', width: 1, height: 1, depth: 1 },
              material: { type: 'standard', color: '#ff0000', metalness: 0.5, roughness: 0.5 },
              autoRotate: [0.01, 0.01, 0],
            }],
          },
        },
      },
    ],
    seeAlso: ['layer'],
  };
}
