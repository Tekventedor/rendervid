# [GAMING-011] AI Capabilities API and MCP Integration

## Overview
Update the capabilities API and MCP server to expose all gaming features to AI agents, with comprehensive documentation and examples.

## Motivation
AI agents need to discover and understand gaming features to generate game-style videos. The capabilities API must be self-describing and include all new gaming features.

## Technical Approach

Extend existing capabilities API with gaming features, update MCP server tools, and create AI-friendly documentation.

### Capabilities API Extensions

```typescript
// packages/core/src/capabilities/gaming.ts

export function getGamingCapabilities(): GamingCapabilities {
  return {
    physics: {
      '3d': {
        engine: 'rapier',
        features: {
          rigidBodies: ['dynamic', 'static', 'kinematic'],
          colliders: ['cuboid', 'sphere', 'capsule', 'cylinder', 'cone', 'trimesh'],
          joints: ['fixed', 'revolute', 'prismatic', 'spherical'],
          forces: ['force', 'impulse', 'torque'],
          collision: {
            events: true,
            filtering: true,
            ccd: true,
          },
        },
        limits: {
          maxBodies: 10000,
          maxColliders: 10000,
          recommendedBodies: 500,
        },
      },
      '2d': {
        engine: 'matter',
        features: {
          rigidBodies: ['dynamic', 'static', 'kinematic'],
          colliders: ['rectangle', 'circle', 'polygon'],
          constraints: ['distance', 'spring', 'revolute', 'prismatic'],
          forces: ['force', 'impulse'],
          collision: {
            events: true,
            filtering: true,
            sensors: true,
          },
        },
        limits: {
          maxBodies: 5000,
          recommendedBodies: 300,
        },
      },
    },
    
    particles: {
      '3d': {
        maxCount: 100000,
        recommendedCount: 10000,
        emitters: ['point', 'sphere', 'box', 'cone', 'mesh'],
        forces: ['gravity', 'wind', 'turbulence', 'attraction', 'vortex'],
        features: {
          collision: true,
          textureAtlas: true,
          softParticles: true,
          trails: false,
        },
      },
      '2d': {
        maxCount: 50000,
        recommendedCount: 5000,
        emitters: ['point', 'rectangle', 'circle'],
        forces: ['gravity', 'wind'],
        features: {
          textureAtlas: true,
          trails: true,
        },
      },
    },
    
    postProcessing: {
      effects: [
        {
          name: 'bloom',
          description: 'Glow effect for bright areas',
          params: {
            intensity: { type: 'number', min: 0, max: 10, default: 1 },
            threshold: { type: 'number', min: 0, max: 1, default: 0.9 },
            radius: { type: 'number', min: 0, max: 1, default: 0.85 },
          },
        },
        {
          name: 'depthOfField',
          description: 'Focus blur effect',
          params: {
            focusDistance: { type: 'number', min: 0, max: 1, default: 0.5 },
            focalLength: { type: 'number', min: 0, max: 1, default: 0.02 },
            bokehScale: { type: 'number', min: 0, max: 10, default: 2 },
          },
        },
        // ... all other effects
      ],
    },
    
    animations: {
      keyframes: {
        properties: [
          'position', 'position.x', 'position.y', 'position.z',
          'rotation', 'rotation.x', 'rotation.y', 'rotation.z',
          'scale', 'scale.x', 'scale.y', 'scale.z',
          'material.color', 'material.opacity', 'material.metalness', 'material.roughness',
          'camera.fov', 'camera.position', 'camera.rotation',
          'light.intensity', 'light.color', 'light.position',
        ],
        easingFunctions: [
          'linear',
          'easeIn', 'easeOut', 'easeInOut',
          'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
          'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
          'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
          'easeInBounce', 'easeOutBounce', 'easeInOutBounce',
          // ... all easing functions
        ],
        loopModes: ['none', 'repeat', 'pingpong'],
      },
    },
    
    behaviors: {
      presets: Object.entries(BEHAVIOR_PRESETS).map(([name, preset]) => ({
        name,
        description: preset.description,
        params: preset.params,
        triggers: preset.triggers || [],
        category: categorize(name),
      })),
      categories: ['movement', 'physics', 'animation', 'procedural', 'ai'],
    },
    
    scripting: {
      enabled: true,
      language: 'javascript',
      hooks: ['onInit', 'onFrame', 'onDestroy', 'onCollision'],
      api: {
        scene: ['getById', 'getAll', 'add', 'remove', 'getCamera', 'getLights'],
        physics: ['applyForce', 'applyImpulse', 'setVelocity', 'getVelocity', 'raycast'],
        particles: ['emit', 'burst'],
        math: {
          vec3: ['add', 'subtract', 'multiply', 'dot', 'cross', 'normalize', 'length', 'distance'],
          random: ['float', 'int', 'choice', 'vector3'],
          noise: ['perlin', 'simplex'],
          utils: ['lerp', 'clamp', 'map'],
        },
        state: ['get', 'set', 'has'],
      },
      limits: {
        timeout: 100,
        memoryMB: 50,
      },
      security: {
        sandbox: true,
        allowedGlobals: ['Math', 'Array', 'Object', 'JSON'],
        blockedGlobals: ['require', 'process', 'eval', 'Function'],
      },
    },
    
    layers: {
      three: {
        geometries: ['box', 'sphere', 'cylinder', 'cone', 'torus', 'plane', 'gltf', 'text3d'],
        materials: ['basic', 'standard', 'physical', 'toon', 'shader'],
        lights: ['ambient', 'directional', 'point', 'spot', 'hemisphere'],
        features: ['shadows', 'fog', 'toneMapping', 'antialias'],
      },
      pixi: {
        objects: ['sprite', 'tilemap', 'graphic', 'text'],
        animations: ['spriteSheet', 'keyframe'],
        filters: ['blur', 'glow', 'pixelate', 'crt', 'glitch', 'oldFilm'],
        features: ['blendModes', 'masks', 'tint'],
      },
    },
  };
}
```

### MCP Server Tools

```typescript
// mcp/src/tools/gaming.ts

export const gamingTools = [
  {
    name: 'create_physics_scene',
    description: 'Create a 3D scene with physics simulation',
    inputSchema: {
      type: 'object',
      properties: {
        objects: {
          type: 'array',
          description: 'Objects with physics properties',
          items: {
            type: 'object',
            properties: {
              geometry: { type: 'object' },
              position: { type: 'array' },
              rigidBody: { type: 'object' },
              collider: { type: 'object' },
            },
          },
        },
        gravity: {
          type: 'array',
          description: 'Gravity vector [x, y, z]',
          default: [0, -9.81, 0],
        },
      },
    },
  },
  
  {
    name: 'add_particle_effect',
    description: 'Add particle system to scene',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['explosion', 'fire', 'smoke', 'magic', 'confetti', 'custom'],
        },
        position: { type: 'array' },
        count: { type: 'number' },
        customConfig: { type: 'object' },
      },
    },
  },
  
  {
    name: 'apply_post_processing',
    description: 'Add cinematic post-processing effects',
    inputSchema: {
      type: 'object',
      properties: {
        effects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              params: { type: 'object' },
            },
          },
        },
      },
    },
  },
  
  {
    name: 'add_behavior',
    description: 'Add preset behavior to object',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string' },
        behavior: {
          type: 'string',
          enum: Object.keys(BEHAVIOR_PRESETS),
        },
        params: { type: 'object' },
      },
    },
  },
  
  {
    name: 'create_2d_game_scene',
    description: 'Create 2D game-style scene with PixiJS',
    inputSchema: {
      type: 'object',
      properties: {
        sprites: { type: 'array' },
        physics: { type: 'object' },
        filters: { type: 'array' },
      },
    },
  },
  
  {
    name: 'get_gaming_examples',
    description: 'Get example templates for gaming features',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['physics', 'particles', 'postProcessing', 'behaviors', '2d', 'all'],
        },
      },
    },
  },
];
```

### AI-Friendly Documentation

```markdown
// docs/ai-guide/gaming-features.md

# Gaming Features for AI Agents

## Quick Start

Generate game-style videos using physics, particles, and behaviors.

### Physics Scene (3D)

```json
{
  "type": "three",
  "props": {
    "physics": { "enabled": true, "gravity": [0, -9.81, 0] },
    "meshes": [
      {
        "id": "ball",
        "geometry": { "type": "sphere", "radius": 0.5 },
        "position": [0, 5, 0],
        "rigidBody": { "type": "dynamic", "mass": 1, "restitution": 0.8 },
        "collider": { "type": "sphere" }
      },
      {
        "id": "ground",
        "geometry": { "type": "plane", "width": 20, "height": 20 },
        "position": [0, 0, 0],
        "rotation": [-1.5708, 0, 0],
        "rigidBody": { "type": "static" },
        "collider": { "type": "cuboid" }
      }
    ]
  }
}
```

### Particle Effects

Common presets:
- **explosion**: Burst of particles with gravity
- **fire**: Rising particles with turbulence
- **smoke**: Slow-moving particles with fade
- **magic**: Colorful particles with attraction
- **confetti**: Falling particles with rotation

### Behaviors

Apply preset behaviors without scripting:

```json
{
  "behaviors": [
    { "type": "orbit", "params": { "radius": 5, "speed": 0.02 } },
    { "type": "pulse", "params": { "minScale": 0.9, "maxScale": 1.1 } }
  ]
}
```

### Post-Processing

Add cinematic effects:

```json
{
  "postProcessing": {
    "bloom": { "intensity": 2, "threshold": 0.8 },
    "depthOfField": { "focusDistance": 0.5, "bokehScale": 3 }
  }
}
```

## Use Cases

### Product Drop Video
- Physics: Dynamic product falling onto static surface
- Particles: Impact particles on collision
- Post-processing: Bloom for dramatic effect
- Behavior: Camera orbit around product

### Explosion Effect
- Particles: Large burst with gravity and turbulence
- Physics: Fragments flying outward
- Post-processing: Motion blur and chromatic aberration
- Behavior: Camera shake

### 2D Platformer Scene
- PixiJS: Sprite animations and tilemaps
- Physics: 2D collision and jumping
- Filters: Pixelate for retro look
- Behavior: Patrol for enemy movement

## Best Practices

1. **Start simple**: Use behaviors before custom scripts
2. **Performance**: Keep particle counts reasonable (<10k for 3D)
3. **Determinism**: Avoid random() in scripts for reproducible renders
4. **Composition**: Combine multiple behaviors for complex effects
5. **Testing**: Use debug visualization to verify physics

## Common Patterns

### Chain Reaction
```json
{
  "meshes": [
    {
      "id": "domino1",
      "rigidBody": { "type": "dynamic" },
      "behaviors": [
        { "type": "applyForceOnTrigger", "params": { "triggerFrame": 30, "force": [10, 0, 0] } }
      ]
    }
  ]
}
```

### Following Camera
```json
{
  "camera": {
    "behaviors": [
      { "type": "follow", "params": { "target": "player", "distance": 5, "smoothing": 0.1 } }
    ]
  }
}
```

### Procedural Animation
```json
{
  "scripts": {
    "hooks": {
      "onFrame": "for (let i = 0; i < 10; i++) { const mesh = scene.getById('particle_' + i); const offset = Math.sin(time.frame * 0.1 + i) * 2; mesh.setPosition([i * 2, offset, 0]); }"
    }
  }
}
```
```

## Implementation Checklist

### Phase 1: Capabilities API
- [ ] Extend capabilities with gaming features
- [ ] Add detailed parameter documentation
- [ ] Include limits and recommendations
- [ ] Add feature detection

### Phase 2: MCP Server
- [ ] Add gaming-specific tools
- [ ] Update existing tools for gaming features
- [ ] Add example retrieval
- [ ] Add validation

### Phase 3: Documentation
- [ ] Create AI guide for gaming features
- [ ] Document all behaviors with examples
- [ ] Create use case library
- [ ] Add troubleshooting guide

### Phase 4: Examples
- [ ] Create 20+ gaming example templates
- [ ] Cover all major features
- [ ] Include common patterns
- [ ] Add complexity levels (beginner to advanced)

### Phase 5: Testing
- [ ] Test AI agent generation
- [ ] Validate all examples
- [ ] Test MCP tools
- [ ] Performance benchmarks

### Phase 6: Skills Documentation
- [ ] Generate skills docs for gaming features
- [ ] Update skills registry
- [ ] Add to MCP server metadata

## Dependencies
- All previous gaming issues (#GAMING-001 through #GAMING-010)

## Acceptance Criteria
- [ ] Capabilities API complete and accurate
- [ ] MCP server tools work correctly
- [ ] AI guide is comprehensive
- [ ] 20+ example templates created
- [ ] All examples validated
- [ ] Skills documentation generated
- [ ] AI agents can successfully generate gaming videos

## Related Issues
- All gaming issues (#GAMING-001 through #GAMING-010)

## Notes
- Keep documentation concise and example-driven
- Focus on common use cases
- Provide copy-paste ready examples
- Include performance guidelines
