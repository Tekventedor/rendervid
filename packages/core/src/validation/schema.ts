import type { JSONSchema7 } from '../types';

/**
 * JSON Schema for position.
 */
export const positionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['x', 'y'],
};

/**
 * JSON Schema for size.
 */
export const sizeSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    width: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
  },
  required: ['width', 'height'],
};

/**
 * JSON Schema for output configuration.
 */
export const outputSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['video', 'image'] },
    width: { type: 'integer', minimum: 1, maximum: 7680 },
    height: { type: 'integer', minimum: 1, maximum: 4320 },
    fps: { type: 'integer', minimum: 1, maximum: 120 },
    duration: { type: 'number', minimum: 0 },
    backgroundColor: { type: 'string' },
  },
  required: ['type', 'width', 'height'],
};

/**
 * JSON Schema for input definition.
 */
export const inputDefinitionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    key: { type: 'string', minLength: 1 },
    type: {
      type: 'string',
      enum: ['string', 'number', 'boolean', 'color', 'url', 'enum', 'richtext', 'date', 'array'],
    },
    label: { type: 'string' },
    description: { type: 'string' },
    required: { type: 'boolean' },
    default: {},
    validation: { type: 'object' },
    ui: { type: 'object' },
  },
  required: ['key', 'type', 'label', 'description', 'required'],
};

/**
 * JSON Schema for animation.
 */
export const animationSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['entrance', 'exit', 'emphasis', 'keyframe'] },
    effect: { type: 'string' },
    duration: { type: 'integer', minimum: 1 },
    delay: { type: 'integer', minimum: 0 },
    easing: { type: 'string' },
    keyframes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          frame: { type: 'integer', minimum: 0 },
          properties: { type: 'object' },
          easing: { type: 'string' },
        },
        required: ['frame', 'properties'],
      },
    },
    loop: { type: 'integer' },
    alternate: { type: 'boolean' },
  },
  required: ['type', 'duration'],
};

/**
 * JSON Schema for Vector3 (3D vector).
 */
export const vector3Schema: JSONSchema7 = {
  type: 'array',
  items: { type: 'number' },
  minItems: 3,
  maxItems: 3,
};

/**
 * JSON Schema for color (hex string or number).
 */
export const colorSchema: JSONSchema7 = {
  oneOf: [
    { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
    { type: 'number', minimum: 0, maximum: 0xffffff },
  ],
};

/**
 * JSON Schema for texture configuration.
 */
export const textureConfigSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    url: { type: 'string', minLength: 1 },
    wrapS: { type: 'string', enum: ['repeat', 'clamp', 'mirror'] },
    wrapT: { type: 'string', enum: ['repeat', 'clamp', 'mirror'] },
    repeat: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    offset: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    rotation: { type: 'number' },
  },
  required: ['url'],
  additionalProperties: false,
};

// ═══════════════════════════════════════════════════════════════
// CAMERA SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for perspective camera.
 */
export const perspectiveCameraSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'perspective' },
    fov: { type: 'number', minimum: 0, maximum: 180 },
    near: { type: 'number', minimum: 0 },
    far: { type: 'number', minimum: 0 },
    position: vector3Schema,
    lookAt: vector3Schema,
  },
  required: ['type', 'fov'],
  additionalProperties: false,
};

/**
 * JSON Schema for orthographic camera.
 */
export const orthographicCameraSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'orthographic' },
    left: { type: 'number' },
    right: { type: 'number' },
    top: { type: 'number' },
    bottom: { type: 'number' },
    near: { type: 'number', minimum: 0 },
    far: { type: 'number', minimum: 0 },
    position: vector3Schema,
    lookAt: vector3Schema,
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for camera configuration (union).
 */
export const cameraConfigSchema: JSONSchema7 = {
  oneOf: [perspectiveCameraSchema, orthographicCameraSchema],
};

// ═══════════════════════════════════════════════════════════════
// LIGHT SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for ambient light.
 */
export const ambientLightSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'ambient' },
    color: colorSchema,
    intensity: { type: 'number', minimum: 0 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for directional light.
 */
export const directionalLightSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'directional' },
    color: colorSchema,
    intensity: { type: 'number', minimum: 0 },
    position: vector3Schema,
    target: vector3Schema,
    castShadow: { type: 'boolean' },
    shadowMapSize: { type: 'number', minimum: 0 },
  },
  required: ['type', 'position'],
  additionalProperties: false,
};

/**
 * JSON Schema for point light.
 */
export const pointLightSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'point' },
    color: colorSchema,
    intensity: { type: 'number', minimum: 0 },
    position: vector3Schema,
    distance: { type: 'number', minimum: 0 },
    decay: { type: 'number', minimum: 0 },
    castShadow: { type: 'boolean' },
  },
  required: ['type', 'position'],
  additionalProperties: false,
};

/**
 * JSON Schema for spot light.
 */
export const spotLightSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'spot' },
    color: colorSchema,
    intensity: { type: 'number', minimum: 0 },
    position: vector3Schema,
    target: vector3Schema,
    distance: { type: 'number', minimum: 0 },
    angle: { type: 'number', minimum: 0, maximum: Math.PI / 2 },
    penumbra: { type: 'number', minimum: 0, maximum: 1 },
    decay: { type: 'number', minimum: 0 },
    castShadow: { type: 'boolean' },
  },
  required: ['type', 'position'],
  additionalProperties: false,
};

/**
 * JSON Schema for hemisphere light.
 */
export const hemisphereLightSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'hemisphere' },
    color: colorSchema,
    intensity: { type: 'number', minimum: 0 },
    groundColor: colorSchema,
    position: vector3Schema,
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for light configuration (union).
 */
export const lightConfigSchema: JSONSchema7 = {
  oneOf: [
    ambientLightSchema,
    directionalLightSchema,
    pointLightSchema,
    spotLightSchema,
    hemisphereLightSchema,
  ],
};

// ═══════════════════════════════════════════════════════════════
// GEOMETRY SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for box geometry.
 */
export const boxGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'box' },
    width: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
    depth: { type: 'number', minimum: 0 },
    widthSegments: { type: 'integer', minimum: 1 },
    heightSegments: { type: 'integer', minimum: 1 },
    depthSegments: { type: 'integer', minimum: 1 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for sphere geometry.
 */
export const sphereGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'sphere' },
    radius: { type: 'number', minimum: 0 },
    widthSegments: { type: 'integer', minimum: 3 },
    heightSegments: { type: 'integer', minimum: 2 },
    phiStart: { type: 'number' },
    phiLength: { type: 'number' },
    thetaStart: { type: 'number' },
    thetaLength: { type: 'number' },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for cylinder geometry.
 */
export const cylinderGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'cylinder' },
    radiusTop: { type: 'number', minimum: 0 },
    radiusBottom: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
    radialSegments: { type: 'integer', minimum: 3 },
    heightSegments: { type: 'integer', minimum: 1 },
    openEnded: { type: 'boolean' },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for cone geometry.
 */
export const coneGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'cone' },
    radius: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
    radialSegments: { type: 'integer', minimum: 3 },
    heightSegments: { type: 'integer', minimum: 1 },
    openEnded: { type: 'boolean' },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for torus geometry.
 */
export const torusGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'torus' },
    radius: { type: 'number', minimum: 0 },
    tube: { type: 'number', minimum: 0 },
    radialSegments: { type: 'integer', minimum: 3 },
    tubularSegments: { type: 'integer', minimum: 3 },
    arc: { type: 'number', minimum: 0, maximum: Math.PI * 2 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for plane geometry.
 */
export const planeGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'plane' },
    width: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
    widthSegments: { type: 'integer', minimum: 1 },
    heightSegments: { type: 'integer', minimum: 1 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for GLTF geometry.
 */
export const gltfGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'gltf' },
    url: { type: 'string', minLength: 1 },
    autoPlay: { type: 'boolean' },
    animationIndex: {
      oneOf: [
        { type: 'integer', minimum: 0 },
        { type: 'string', minLength: 1 },
      ],
    },
    animationSpeed: { type: 'number' },
    scale: { type: 'number', minimum: 0 },
  },
  required: ['type', 'url'],
  additionalProperties: false,
};

/**
 * JSON Schema for 3D text geometry.
 */
export const text3DGeometrySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'text3d' },
    text: { type: 'string' },
    font: { type: 'string', minLength: 1 },
    size: { type: 'number', minimum: 0 },
    height: { type: 'number', minimum: 0 },
    curveSegments: { type: 'integer', minimum: 1 },
    bevelEnabled: { type: 'boolean' },
    bevelThickness: { type: 'number', minimum: 0 },
    bevelSize: { type: 'number', minimum: 0 },
    bevelSegments: { type: 'integer', minimum: 0 },
  },
  required: ['type', 'text', 'font'],
  additionalProperties: false,
};

/**
 * JSON Schema for geometry configuration (union).
 */
export const geometryConfigSchema: JSONSchema7 = {
  oneOf: [
    boxGeometrySchema,
    sphereGeometrySchema,
    cylinderGeometrySchema,
    coneGeometrySchema,
    torusGeometrySchema,
    planeGeometrySchema,
    gltfGeometrySchema,
    text3DGeometrySchema,
  ],
};

// ═══════════════════════════════════════════════════════════════
// MATERIAL SCHEMAS
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for standard material.
 */
export const standardMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'standard' },
    color: colorSchema,
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    metalness: { type: 'number', minimum: 0, maximum: 1 },
    roughness: { type: 'number', minimum: 0, maximum: 1 },
    map: textureConfigSchema,
    normalMap: textureConfigSchema,
    normalScale: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    roughnessMap: textureConfigSchema,
    metalnessMap: textureConfigSchema,
    aoMap: textureConfigSchema,
    aoMapIntensity: { type: 'number', minimum: 0 },
    emissive: colorSchema,
    emissiveIntensity: { type: 'number', minimum: 0 },
    emissiveMap: textureConfigSchema,
    envMap: textureConfigSchema,
    envMapIntensity: { type: 'number', minimum: 0 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for basic material.
 */
export const basicMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'basic' },
    color: colorSchema,
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    map: textureConfigSchema,
    envMap: textureConfigSchema,
    combine: { type: 'string', enum: ['multiply', 'mix', 'add'] },
    reflectivity: { type: 'number', minimum: 0, maximum: 1 },
    refractionRatio: { type: 'number', minimum: 0, maximum: 1 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for phong material.
 */
export const phongMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'phong' },
    color: colorSchema,
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    specular: colorSchema,
    shininess: { type: 'number', minimum: 0 },
    map: textureConfigSchema,
    normalMap: textureConfigSchema,
    normalScale: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    specularMap: textureConfigSchema,
    emissive: colorSchema,
    emissiveMap: textureConfigSchema,
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for physical material.
 */
export const physicalMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'physical' },
    color: colorSchema,
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    metalness: { type: 'number', minimum: 0, maximum: 1 },
    roughness: { type: 'number', minimum: 0, maximum: 1 },
    map: textureConfigSchema,
    normalMap: textureConfigSchema,
    normalScale: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    roughnessMap: textureConfigSchema,
    metalnessMap: textureConfigSchema,
    aoMap: textureConfigSchema,
    aoMapIntensity: { type: 'number', minimum: 0 },
    emissive: colorSchema,
    emissiveIntensity: { type: 'number', minimum: 0 },
    emissiveMap: textureConfigSchema,
    envMap: textureConfigSchema,
    envMapIntensity: { type: 'number', minimum: 0 },
    clearcoat: { type: 'number', minimum: 0, maximum: 1 },
    clearcoatRoughness: { type: 'number', minimum: 0, maximum: 1 },
    sheen: { type: 'number', minimum: 0, maximum: 1 },
    sheenColor: colorSchema,
    transmission: { type: 'number', minimum: 0, maximum: 1 },
    thickness: { type: 'number', minimum: 0 },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for normal material.
 */
export const normalMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'normal' },
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    normalMap: textureConfigSchema,
    normalScale: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ['type'],
  additionalProperties: false,
};

/**
 * JSON Schema for matcap material.
 */
export const matcapMaterialSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { const: 'matcap' },
    color: colorSchema,
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    transparent: { type: 'boolean' },
    side: { type: 'string', enum: ['front', 'back', 'double'] },
    flatShading: { type: 'boolean' },
    wireframe: { type: 'boolean' },
    matcap: textureConfigSchema,
    map: textureConfigSchema,
    normalMap: textureConfigSchema,
    normalScale: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ['type', 'matcap'],
  additionalProperties: false,
};

/**
 * JSON Schema for material configuration (union).
 */
export const materialConfigSchema: JSONSchema7 = {
  oneOf: [
    standardMaterialSchema,
    basicMaterialSchema,
    phongMaterialSchema,
    physicalMaterialSchema,
    normalMaterialSchema,
    matcapMaterialSchema,
  ],
};

// ═══════════════════════════════════════════════════════════════
// MESH SCHEMA
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for 3D mesh configuration.
 */
export const meshConfigSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string' },
    geometry: geometryConfigSchema,
    material: materialConfigSchema,
    position: vector3Schema,
    rotation: vector3Schema,
    scale: vector3Schema,
    castShadow: { type: 'boolean' },
    receiveShadow: { type: 'boolean' },
    visible: { type: 'boolean' },
    renderOrder: { type: 'integer' },
    autoRotate: vector3Schema,
  },
  required: ['id', 'geometry', 'material'],
  additionalProperties: false,
};

// ═══════════════════════════════════════════════════════════════
// THREE LAYER PROPS SCHEMA
// ═══════════════════════════════════════════════════════════════

/**
 * JSON Schema for Three.js layer props.
 */
export const threeLayerPropsSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    camera: cameraConfigSchema,
    lights: {
      type: 'array',
      items: lightConfigSchema,
    },
    meshes: {
      type: 'array',
      items: meshConfigSchema,
      minItems: 1,
    },
    background: {
      oneOf: [colorSchema, textureConfigSchema],
    },
    fog: {
      type: 'object',
      properties: {
        color: colorSchema,
        near: { type: 'number', minimum: 0 },
        far: { type: 'number', minimum: 0 },
      },
      required: ['color', 'near', 'far'],
      additionalProperties: false,
    },
    antialias: { type: 'boolean' },
    shadows: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        type: { type: 'string', enum: ['basic', 'pcf', 'pcfsoft', 'vsm'] },
      },
      required: ['enabled'],
      additionalProperties: false,
    },
    toneMapping: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['none', 'linear', 'reinhard', 'cineon', 'aces'] },
        exposure: { type: 'number', minimum: 0 },
      },
      required: ['type'],
      additionalProperties: false,
    },
    controls: { type: 'boolean' },
    customShader: {
      type: 'object',
      properties: {
        vertexShader: { type: 'string' },
        fragmentShader: { type: 'string' },
        uniforms: { type: 'object' },
      },
      additionalProperties: false,
    },
  },
  required: ['camera', 'meshes'],
  additionalProperties: false,
};

/**
 * JSON Schema for base layer properties.
 */
export const layerBaseSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    type: {
      type: 'string',
      enum: ['image', 'video', 'text', 'shape', 'audio', 'group', 'lottie', 'custom', 'three'],
    },
    name: { type: 'string' },
    position: positionSchema,
    size: sizeSchema,
    rotation: { type: 'number' },
    scale: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
      },
    },
    anchor: {
      type: 'object',
      properties: {
        x: { type: 'number', minimum: 0, maximum: 1 },
        y: { type: 'number', minimum: 0, maximum: 1 },
      },
    },
    from: { type: 'integer', minimum: 0 },
    duration: { type: 'integer' },
    opacity: { type: 'number', minimum: 0, maximum: 1 },
    blendMode: {
      type: 'string',
      enum: [
        'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
        'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
      ],
    },
    filters: { type: 'array' },
    shadow: {
      type: 'object',
      properties: {
        color: { type: 'string' },
        blur: { type: 'number', minimum: 0 },
        offsetX: { type: 'number' },
        offsetY: { type: 'number' },
      },
    },
    clipPath: { type: 'string' },
    maskLayer: { type: 'string' },
    style: { type: 'object' },
    className: { type: 'string' },
    inputKey: { type: 'string' },
    inputProperty: { type: 'string' },
    animations: { type: 'array', items: animationSchema },
    props: { type: 'object' },
    locked: { type: 'boolean' },
    hidden: { type: 'boolean' },
  },
  required: ['id', 'type', 'position', 'size'],
};

/**
 * JSON Schema for scene transition.
 */
export const transitionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['cut', 'fade', 'slide', 'wipe', 'zoom'] },
    duration: { type: 'integer', minimum: 1 },
    direction: { type: 'string', enum: ['left', 'right', 'up', 'down'] },
    easing: { type: 'string' },
  },
  required: ['type', 'duration'],
};

/**
 * JSON Schema for scene.
 */
export const sceneSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    name: { type: 'string' },
    startFrame: { type: 'integer', minimum: 0 },
    endFrame: { type: 'integer', minimum: 1 },
    backgroundColor: { type: 'string' },
    backgroundImage: { type: 'string' },
    backgroundFit: { type: 'string', enum: ['cover', 'contain', 'fill', 'none'] },
    backgroundVideo: { type: 'string' },
    transition: transitionSchema,
    layers: {
      type: 'array',
      items: layerBaseSchema,
    },
  },
  required: ['id', 'startFrame', 'endFrame', 'layers'],
};

/**
 * JSON Schema for composition.
 */
export const compositionSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    scenes: {
      type: 'array',
      items: sceneSchema,
      minItems: 1,
    },
    assets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string', enum: ['image', 'video', 'audio', 'font', 'lottie'] },
          url: { type: 'string' },
          name: { type: 'string' },
        },
        required: ['id', 'type', 'url'],
      },
    },
  },
  required: ['scenes'],
};

/**
 * JSON Schema for custom component definition.
 */
export const customComponentSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['reference', 'url', 'inline'] },
    reference: { type: 'string' },
    url: { type: 'string' },
    code: { type: 'string' },
    propsSchema: { type: 'object' },
    description: { type: 'string' },
  },
  required: ['type'],
};

/**
 * JSON Schema for font source definition.
 */
export const fontSourceSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    url: { type: 'string' },
    local: {
      oneOf: [
        { type: 'string' },
        { type: 'array', items: { type: 'string' } },
      ],
    },
    format: {
      type: 'string',
      enum: ['woff2', 'woff', 'truetype', 'opentype', 'embedded-opentype', 'svg'],
    },
    weight: {
      type: 'integer',
      enum: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    style: {
      type: 'string',
      enum: ['normal', 'italic', 'oblique'],
    },
  },
  additionalProperties: false,
};

/**
 * JSON Schema for font family definition.
 */
export const fontFamilySchema: JSONSchema7 = {
  type: 'object',
  properties: {
    family: { type: 'string', minLength: 1 },
    sources: {
      type: 'array',
      items: fontSourceSchema,
      minItems: 1,
    },
    display: {
      type: 'string',
      enum: ['auto', 'block', 'swap', 'fallback', 'optional'],
    },
    fallback: {
      type: 'array',
      items: { type: 'string' },
    },
    preload: { type: 'boolean' },
  },
  required: ['family', 'sources'],
  additionalProperties: false,
};

/**
 * JSON Schema for font configuration.
 */
export const fontConfigurationSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    families: {
      type: 'array',
      items: fontFamilySchema,
      minItems: 1,
    },
    basePath: { type: 'string' },
  },
  required: ['families'],
  additionalProperties: false,
};

/**
 * Complete JSON Schema for template.
 */
export const templateSchema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Rendervid Template',
  description: 'A Rendervid video/image template',
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    version: { type: 'string' },
    author: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        url: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
    },
    tags: { type: 'array', items: { type: 'string' } },
    thumbnail: { type: 'string' },
    output: outputSchema,
    inputs: {
      type: 'array',
      items: inputDefinitionSchema,
    },
    defaults: { type: 'object' },
    customComponents: {
      type: 'object',
      additionalProperties: customComponentSchema,
    },
    fonts: fontConfigurationSchema,
    composition: compositionSchema,
  },
  required: ['name', 'output', 'inputs', 'composition'],
};

/**
 * Get the template schema.
 */
export function getTemplateSchema(): JSONSchema7 {
  return templateSchema;
}

/**
 * Get schema for a specific layer type.
 */
export function getLayerSchema(type: string): JSONSchema7 | null {
  // Layer-specific props schemas would be defined here
  // For now, return the base schema
  return layerBaseSchema;
}
