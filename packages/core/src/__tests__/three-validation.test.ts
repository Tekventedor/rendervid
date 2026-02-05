import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  vector3Schema,
  colorSchema,
  textureConfigSchema,
  perspectiveCameraSchema,
  orthographicCameraSchema,
  cameraConfigSchema,
  ambientLightSchema,
  directionalLightSchema,
  pointLightSchema,
  spotLightSchema,
  hemisphereLightSchema,
  lightConfigSchema,
  boxGeometrySchema,
  sphereGeometrySchema,
  cylinderGeometrySchema,
  coneGeometrySchema,
  torusGeometrySchema,
  planeGeometrySchema,
  gltfGeometrySchema,
  text3DGeometrySchema,
  geometryConfigSchema,
  standardMaterialSchema,
  basicMaterialSchema,
  phongMaterialSchema,
  physicalMaterialSchema,
  normalMaterialSchema,
  matcapMaterialSchema,
  materialConfigSchema,
  meshConfigSchema,
  threeLayerPropsSchema,
} from '../validation/schema';

/**
 * Helper to create AJV validator.
 */
function createValidator() {
  const ajv = new Ajv({ allErrors: true, verbose: true, strict: false });
  addFormats(ajv);
  return ajv;
}

describe('Three.js Vector3 Schema', () => {
  const ajv = createValidator();
  const validate = ajv.compile(vector3Schema);

  it('should validate valid Vector3', () => {
    expect(validate([0, 0, 0])).toBe(true);
    expect(validate([1, 2, 3])).toBe(true);
    expect(validate([-5.5, 10.2, 0])).toBe(true);
  });

  it('should reject invalid Vector3', () => {
    expect(validate([1, 2])).toBe(false); // Too few items
    expect(validate([1, 2, 3, 4])).toBe(false); // Too many items
    expect(validate(['a', 'b', 'c'])).toBe(false); // Not numbers
    expect(validate(123)).toBe(false); // Not array
  });
});

describe('Three.js Color Schema', () => {
  const ajv = createValidator();
  const validate = ajv.compile(colorSchema);

  it('should validate valid colors', () => {
    expect(validate('#ffffff')).toBe(true);
    expect(validate('#000000')).toBe(true);
    expect(validate('#ff0000')).toBe(true);
    expect(validate('#ABC123')).toBe(true);
    expect(validate(0xffffff)).toBe(true);
    expect(validate(0x000000)).toBe(true);
    expect(validate(0xff0000)).toBe(true);
  });

  it('should reject invalid colors', () => {
    expect(validate('#fff')).toBe(false); // Too short
    expect(validate('#gggggg')).toBe(false); // Invalid hex
    expect(validate('red')).toBe(false); // Not hex format
    expect(validate(-1)).toBe(false); // Negative number
    expect(validate(0x1000000)).toBe(false); // Out of range
  });
});

describe('Three.js Texture Schema', () => {
  const ajv = createValidator();
  const validate = ajv.compile(textureConfigSchema);

  it('should validate valid texture config', () => {
    expect(validate({ url: 'texture.jpg' })).toBe(true);
    expect(
      validate({
        url: 'texture.png',
        wrapS: 'repeat',
        wrapT: 'clamp',
        repeat: [2, 2],
        offset: [0.5, 0.5],
        rotation: Math.PI / 4,
      })
    ).toBe(true);
  });

  it('should reject invalid texture config', () => {
    expect(validate({})).toBe(false); // Missing url
    expect(validate({ url: '' })).toBe(false); // Empty url
    expect(validate({ url: 'test.jpg', wrapS: 'invalid' })).toBe(false); // Invalid enum
    expect(validate({ url: 'test.jpg', repeat: [1, 2, 3] })).toBe(false); // Wrong array size
  });
});

describe('Three.js Camera Schemas', () => {
  const ajv = createValidator();

  describe('Perspective Camera', () => {
    const validate = ajv.compile(perspectiveCameraSchema);

    it('should validate valid perspective camera', () => {
      expect(validate({ type: 'perspective', fov: 75 })).toBe(true);
      expect(
        validate({
          type: 'perspective',
          fov: 60,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5],
          lookAt: [0, 0, 0],
        })
      ).toBe(true);
    });

    it('should reject invalid perspective camera', () => {
      expect(validate({ type: 'perspective' })).toBe(false); // Missing fov
      expect(validate({ type: 'perspective', fov: 200 })).toBe(false); // FOV out of range
      expect(validate({ type: 'perspective', fov: -10 })).toBe(false); // Negative FOV
      expect(validate({ type: 'perspective', fov: 75, near: -1 })).toBe(false); // Negative near
    });
  });

  describe('Orthographic Camera', () => {
    const validate = ajv.compile(orthographicCameraSchema);

    it('should validate valid orthographic camera', () => {
      expect(validate({ type: 'orthographic' })).toBe(true);
      expect(
        validate({
          type: 'orthographic',
          left: -10,
          right: 10,
          top: 10,
          bottom: -10,
          near: 0.1,
          far: 1000,
        })
      ).toBe(true);
    });

    it('should reject invalid orthographic camera', () => {
      expect(validate({ type: 'orthographic', near: -1 })).toBe(false); // Negative near
    });
  });

  describe('Camera Config Union', () => {
    const validate = ajv.compile(cameraConfigSchema);

    it('should validate both camera types', () => {
      expect(validate({ type: 'perspective', fov: 75 })).toBe(true);
      expect(validate({ type: 'orthographic' })).toBe(true);
    });

    it('should reject invalid camera types', () => {
      expect(validate({ type: 'invalid' })).toBe(false);
    });
  });
});

describe('Three.js Light Schemas', () => {
  const ajv = createValidator();

  describe('Ambient Light', () => {
    const validate = ajv.compile(ambientLightSchema);

    it('should validate valid ambient light', () => {
      expect(validate({ type: 'ambient' })).toBe(true);
      expect(validate({ type: 'ambient', color: '#ffffff', intensity: 0.5 })).toBe(true);
    });

    it('should reject invalid ambient light', () => {
      expect(validate({ type: 'ambient', intensity: -1 })).toBe(false); // Negative intensity
    });
  });

  describe('Directional Light', () => {
    const validate = ajv.compile(directionalLightSchema);

    it('should validate valid directional light', () => {
      expect(validate({ type: 'directional', position: [5, 5, 5] })).toBe(true);
      expect(
        validate({
          type: 'directional',
          position: [10, 10, 10],
          target: [0, 0, 0],
          intensity: 1,
          castShadow: true,
          shadowMapSize: 1024,
        })
      ).toBe(true);
    });

    it('should reject invalid directional light', () => {
      expect(validate({ type: 'directional' })).toBe(false); // Missing position
      expect(validate({ type: 'directional', position: [1, 2] })).toBe(false); // Invalid Vector3
    });
  });

  describe('Point Light', () => {
    const validate = ajv.compile(pointLightSchema);

    it('should validate valid point light', () => {
      expect(validate({ type: 'point', position: [0, 5, 0] })).toBe(true);
      expect(
        validate({
          type: 'point',
          position: [0, 5, 0],
          color: 0xff0000,
          intensity: 2,
          distance: 100,
          decay: 2,
          castShadow: true,
        })
      ).toBe(true);
    });

    it('should reject invalid point light', () => {
      expect(validate({ type: 'point' })).toBe(false); // Missing position
      expect(validate({ type: 'point', position: [0, 5, 0], distance: -10 })).toBe(false); // Negative distance
    });
  });

  describe('Spot Light', () => {
    const validate = ajv.compile(spotLightSchema);

    it('should validate valid spot light', () => {
      expect(validate({ type: 'spot', position: [0, 10, 0] })).toBe(true);
      expect(
        validate({
          type: 'spot',
          position: [0, 10, 0],
          target: [0, 0, 0],
          angle: Math.PI / 6,
          penumbra: 0.5,
          distance: 100,
          decay: 2,
        })
      ).toBe(true);
    });

    it('should reject invalid spot light', () => {
      expect(validate({ type: 'spot' })).toBe(false); // Missing position
      expect(validate({ type: 'spot', position: [0, 10, 0], penumbra: 2 })).toBe(false); // Penumbra out of range
      expect(validate({ type: 'spot', position: [0, 10, 0], angle: Math.PI })).toBe(false); // Angle too large
    });
  });

  describe('Hemisphere Light', () => {
    const validate = ajv.compile(hemisphereLightSchema);

    it('should validate valid hemisphere light', () => {
      expect(validate({ type: 'hemisphere' })).toBe(true);
      expect(
        validate({
          type: 'hemisphere',
          color: '#ffffff',
          groundColor: '#000000',
          intensity: 0.5,
          position: [0, 10, 0],
        })
      ).toBe(true);
    });
  });

  describe('Light Config Union', () => {
    const validate = ajv.compile(lightConfigSchema);

    it('should validate all light types', () => {
      expect(validate({ type: 'ambient' })).toBe(true);
      expect(validate({ type: 'directional', position: [5, 5, 5] })).toBe(true);
      expect(validate({ type: 'point', position: [0, 5, 0] })).toBe(true);
      expect(validate({ type: 'spot', position: [0, 10, 0] })).toBe(true);
      expect(validate({ type: 'hemisphere' })).toBe(true);
    });
  });
});

describe('Three.js Geometry Schemas', () => {
  const ajv = createValidator();

  describe('Box Geometry', () => {
    const validate = ajv.compile(boxGeometrySchema);

    it('should validate valid box geometry', () => {
      expect(validate({ type: 'box' })).toBe(true);
      expect(
        validate({
          type: 'box',
          width: 2,
          height: 2,
          depth: 2,
          widthSegments: 4,
          heightSegments: 4,
          depthSegments: 4,
        })
      ).toBe(true);
    });

    it('should reject invalid box geometry', () => {
      expect(validate({ type: 'box', width: -1 })).toBe(false); // Negative dimension
      expect(validate({ type: 'box', widthSegments: 0 })).toBe(false); // Zero segments
      expect(validate({ type: 'box', widthSegments: 1.5 })).toBe(false); // Non-integer segments
    });
  });

  describe('Sphere Geometry', () => {
    const validate = ajv.compile(sphereGeometrySchema);

    it('should validate valid sphere geometry', () => {
      expect(validate({ type: 'sphere' })).toBe(true);
      expect(
        validate({
          type: 'sphere',
          radius: 1,
          widthSegments: 32,
          heightSegments: 16,
        })
      ).toBe(true);
    });

    it('should reject invalid sphere geometry', () => {
      expect(validate({ type: 'sphere', widthSegments: 2 })).toBe(false); // Below minimum
      expect(validate({ type: 'sphere', heightSegments: 1 })).toBe(false); // Below minimum
    });
  });

  describe('Cylinder Geometry', () => {
    const validate = ajv.compile(cylinderGeometrySchema);

    it('should validate valid cylinder geometry', () => {
      expect(validate({ type: 'cylinder' })).toBe(true);
      expect(
        validate({
          type: 'cylinder',
          radiusTop: 1,
          radiusBottom: 1,
          height: 2,
          radialSegments: 8,
          heightSegments: 1,
          openEnded: false,
        })
      ).toBe(true);
    });

    it('should reject invalid cylinder geometry', () => {
      expect(validate({ type: 'cylinder', radialSegments: 2 })).toBe(false); // Below minimum
    });
  });

  describe('Cone Geometry', () => {
    const validate = ajv.compile(coneGeometrySchema);

    it('should validate valid cone geometry', () => {
      expect(validate({ type: 'cone' })).toBe(true);
      expect(
        validate({
          type: 'cone',
          radius: 1,
          height: 2,
          radialSegments: 8,
        })
      ).toBe(true);
    });
  });

  describe('Torus Geometry', () => {
    const validate = ajv.compile(torusGeometrySchema);

    it('should validate valid torus geometry', () => {
      expect(validate({ type: 'torus' })).toBe(true);
      expect(
        validate({
          type: 'torus',
          radius: 1,
          tube: 0.4,
          radialSegments: 16,
          tubularSegments: 100,
          arc: Math.PI * 2,
        })
      ).toBe(true);
    });

    it('should reject invalid torus geometry', () => {
      expect(validate({ type: 'torus', arc: Math.PI * 3 })).toBe(false); // Arc out of range
    });
  });

  describe('Plane Geometry', () => {
    const validate = ajv.compile(planeGeometrySchema);

    it('should validate valid plane geometry', () => {
      expect(validate({ type: 'plane' })).toBe(true);
      expect(
        validate({
          type: 'plane',
          width: 10,
          height: 10,
          widthSegments: 1,
          heightSegments: 1,
        })
      ).toBe(true);
    });
  });

  describe('GLTF Geometry', () => {
    const validate = ajv.compile(gltfGeometrySchema);

    it('should validate valid GLTF geometry', () => {
      expect(validate({ type: 'gltf', url: 'model.gltf' })).toBe(true);
      expect(
        validate({
          type: 'gltf',
          url: 'model.glb',
          autoPlay: true,
          animationIndex: 0,
          animationSpeed: 1.5,
          scale: 2,
        })
      ).toBe(true);
      expect(
        validate({
          type: 'gltf',
          url: 'model.glb',
          animationIndex: 'walk',
        })
      ).toBe(true);
    });

    it('should reject invalid GLTF geometry', () => {
      expect(validate({ type: 'gltf' })).toBe(false); // Missing url
      expect(validate({ type: 'gltf', url: '' })).toBe(false); // Empty url
      expect(validate({ type: 'gltf', url: 'model.gltf', scale: -1 })).toBe(false); // Negative scale
    });
  });

  describe('Text3D Geometry', () => {
    const validate = ajv.compile(text3DGeometrySchema);

    it('should validate valid Text3D geometry', () => {
      expect(validate({ type: 'text3d', text: 'Hello', font: 'font.json' })).toBe(true);
      expect(
        validate({
          type: 'text3d',
          text: '3D Text',
          font: 'helvetiker.json',
          size: 1,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 5,
        })
      ).toBe(true);
    });

    it('should reject invalid Text3D geometry', () => {
      expect(validate({ type: 'text3d', text: 'Hello' })).toBe(false); // Missing font
      expect(validate({ type: 'text3d', font: 'font.json' })).toBe(false); // Missing text
      expect(validate({ type: 'text3d', text: 'Hi', font: 'font.json', size: -1 })).toBe(false); // Negative size
    });
  });

  describe('Geometry Config Union', () => {
    const validate = ajv.compile(geometryConfigSchema);

    it('should validate all geometry types', () => {
      expect(validate({ type: 'box' })).toBe(true);
      expect(validate({ type: 'sphere' })).toBe(true);
      expect(validate({ type: 'cylinder' })).toBe(true);
      expect(validate({ type: 'cone' })).toBe(true);
      expect(validate({ type: 'torus' })).toBe(true);
      expect(validate({ type: 'plane' })).toBe(true);
      expect(validate({ type: 'gltf', url: 'model.gltf' })).toBe(true);
      expect(validate({ type: 'text3d', text: 'Hi', font: 'font.json' })).toBe(true);
    });
  });
});

describe('Three.js Material Schemas', () => {
  const ajv = createValidator();

  describe('Standard Material', () => {
    const validate = ajv.compile(standardMaterialSchema);

    it('should validate valid standard material', () => {
      expect(validate({ type: 'standard' })).toBe(true);
      expect(
        validate({
          type: 'standard',
          color: '#ff0000',
          metalness: 0.5,
          roughness: 0.5,
          opacity: 1,
          transparent: false,
        })
      ).toBe(true);
    });

    it('should reject invalid standard material', () => {
      expect(validate({ type: 'standard', metalness: 2 })).toBe(false); // Out of range
      expect(validate({ type: 'standard', roughness: -0.1 })).toBe(false); // Out of range
      expect(validate({ type: 'standard', opacity: 1.5 })).toBe(false); // Out of range
    });
  });

  describe('Basic Material', () => {
    const validate = ajv.compile(basicMaterialSchema);

    it('should validate valid basic material', () => {
      expect(validate({ type: 'basic' })).toBe(true);
      expect(
        validate({
          type: 'basic',
          color: 0x00ff00,
          opacity: 0.5,
          transparent: true,
        })
      ).toBe(true);
    });

    it('should reject invalid basic material', () => {
      expect(validate({ type: 'basic', reflectivity: 2 })).toBe(false); // Out of range
      expect(validate({ type: 'basic', combine: 'invalid' })).toBe(false); // Invalid enum
    });
  });

  describe('Phong Material', () => {
    const validate = ajv.compile(phongMaterialSchema);

    it('should validate valid phong material', () => {
      expect(validate({ type: 'phong' })).toBe(true);
      expect(
        validate({
          type: 'phong',
          color: '#ffffff',
          specular: '#111111',
          shininess: 30,
        })
      ).toBe(true);
    });

    it('should reject invalid phong material', () => {
      expect(validate({ type: 'phong', shininess: -10 })).toBe(false); // Negative shininess
    });
  });

  describe('Physical Material', () => {
    const validate = ajv.compile(physicalMaterialSchema);

    it('should validate valid physical material', () => {
      expect(validate({ type: 'physical' })).toBe(true);
      expect(
        validate({
          type: 'physical',
          metalness: 1,
          roughness: 0.2,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          transmission: 0.8,
        })
      ).toBe(true);
    });

    it('should reject invalid physical material', () => {
      expect(validate({ type: 'physical', clearcoat: 1.5 })).toBe(false); // Out of range
      expect(validate({ type: 'physical', transmission: -0.1 })).toBe(false); // Out of range
    });
  });

  describe('Normal Material', () => {
    const validate = ajv.compile(normalMaterialSchema);

    it('should validate valid normal material', () => {
      expect(validate({ type: 'normal' })).toBe(true);
      expect(
        validate({
          type: 'normal',
          flatShading: true,
        })
      ).toBe(true);
    });
  });

  describe('MatCap Material', () => {
    const validate = ajv.compile(matcapMaterialSchema);

    it('should validate valid matcap material', () => {
      expect(validate({ type: 'matcap', matcap: { url: 'matcap.jpg' } })).toBe(true);
      expect(
        validate({
          type: 'matcap',
          matcap: { url: 'matcap.jpg' },
          map: { url: 'texture.jpg' },
        })
      ).toBe(true);
    });

    it('should reject invalid matcap material', () => {
      expect(validate({ type: 'matcap' })).toBe(false); // Missing matcap
    });
  });

  describe('Material Config Union', () => {
    const validate = ajv.compile(materialConfigSchema);

    it('should validate all material types', () => {
      expect(validate({ type: 'standard' })).toBe(true);
      expect(validate({ type: 'basic' })).toBe(true);
      expect(validate({ type: 'phong' })).toBe(true);
      expect(validate({ type: 'physical' })).toBe(true);
      expect(validate({ type: 'normal' })).toBe(true);
      expect(validate({ type: 'matcap', matcap: { url: 'matcap.jpg' } })).toBe(true);
    });
  });
});

describe('Three.js Mesh Schema', () => {
  const ajv = createValidator();
  const validate = ajv.compile(meshConfigSchema);

  it('should validate valid mesh config', () => {
    expect(
      validate({
        id: 'mesh-1',
        geometry: { type: 'box' },
        material: { type: 'standard' },
      })
    ).toBe(true);

    expect(
      validate({
        id: 'mesh-2',
        name: 'My Cube',
        geometry: { type: 'box', width: 2, height: 2, depth: 2 },
        material: { type: 'standard', color: '#ff0000', metalness: 0.5, roughness: 0.5 },
        position: [0, 0, 0],
        rotation: [0, Math.PI / 4, 0],
        scale: [1, 1, 1],
        castShadow: true,
        receiveShadow: true,
        visible: true,
        renderOrder: 0,
        autoRotate: [0.01, 0.01, 0],
      })
    ).toBe(true);
  });

  it('should reject invalid mesh config', () => {
    expect(validate({ id: 'mesh-1' })).toBe(false); // Missing geometry and material
    expect(
      validate({
        id: 'mesh-1',
        geometry: { type: 'box' },
      })
    ).toBe(false); // Missing material
    expect(
      validate({
        id: 'mesh-1',
        geometry: { type: 'box' },
        material: { type: 'standard' },
        position: [1, 2],
      })
    ).toBe(false); // Invalid Vector3
  });
});

describe('Three.js Layer Props Schema', () => {
  const ajv = createValidator();
  const validate = ajv.compile(threeLayerPropsSchema);

  it('should validate minimal valid configuration', () => {
    expect(
      validate({
        camera: { type: 'perspective', fov: 75 },
        meshes: [
          {
            id: 'mesh-1',
            geometry: { type: 'box' },
            material: { type: 'standard' },
          },
        ],
      })
    ).toBe(true);
  });

  it('should validate complete configuration', () => {
    expect(
      validate({
        camera: {
          type: 'perspective',
          fov: 75,
          position: [0, 0, 5],
          lookAt: [0, 0, 0],
        },
        lights: [
          { type: 'ambient', intensity: 0.5 },
          { type: 'directional', position: [5, 5, 5], intensity: 1 },
        ],
        meshes: [
          {
            id: 'cube-1',
            geometry: { type: 'box', width: 1, height: 1, depth: 1 },
            material: { type: 'standard', color: '#ff0000', metalness: 0.5, roughness: 0.5 },
            position: [0, 0, 0],
            autoRotate: [0.01, 0.01, 0],
          },
        ],
        background: '#000000',
        fog: { color: '#ffffff', near: 1, far: 100 },
        antialias: true,
        shadows: { enabled: true, type: 'pcf' },
        toneMapping: { type: 'aces', exposure: 1 },
        controls: false,
      })
    ).toBe(true);
  });

  it('should reject invalid configurations', () => {
    expect(validate({})).toBe(false); // Missing camera and meshes
    expect(
      validate({
        camera: { type: 'perspective', fov: 75 },
      })
    ).toBe(false); // Missing meshes
    expect(
      validate({
        camera: { type: 'perspective', fov: 75 },
        meshes: [],
      })
    ).toBe(false); // Empty meshes array
    expect(
      validate({
        camera: { type: 'perspective', fov: 75 },
        meshes: [{ id: 'mesh-1', geometry: { type: 'box' }, material: { type: 'standard' } }],
        fog: { color: '#ffffff', near: -1, far: 100 },
      })
    ).toBe(false); // Negative fog near
  });

  it('should validate with texture background', () => {
    expect(
      validate({
        camera: { type: 'perspective', fov: 75 },
        meshes: [
          {
            id: 'mesh-1',
            geometry: { type: 'box' },
            material: { type: 'standard' },
          },
        ],
        background: { url: 'sky.jpg' },
      })
    ).toBe(true);
  });
});

describe('Three.js Complete Layer Integration', () => {
  it('should validate a complete Three.js layer in a template', () => {
    const ajv = createValidator();
    const validate = ajv.compile({
      type: 'object',
      properties: {
        id: { type: 'string', minLength: 1 },
        type: { const: 'three' },
        position: { type: 'object' },
        size: { type: 'object' },
        props: threeLayerPropsSchema,
      },
      required: ['id', 'type', 'position', 'size', 'props'],
    });

    const threeLayer = {
      id: 'three-scene-1',
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
            id: 'cube-1',
            geometry: { type: 'box', width: 1, height: 1, depth: 1 },
            material: { type: 'standard', color: '#ff0000', metalness: 0.5, roughness: 0.5 },
            autoRotate: [0.01, 0.01, 0],
          },
        ],
      },
    };

    expect(validate(threeLayer)).toBe(true);
  });
});
