# [GAMING-004] GPU Particle System for Three.js

## Overview
Create a high-performance GPU-accelerated particle system for Three.js layer, supporting 10,000+ particles with emitters, forces, and collision.

## Motivation
Particles are essential for game effects: explosions, fire, smoke, magic spells, trails, weather effects. GPU acceleration enables massive particle counts without performance issues.

## Technical Approach

### Architecture

Use instanced rendering with custom shaders for maximum performance:
- Single draw call for all particles
- GPU-side position/velocity updates
- Texture atlases for variety
- Compute shaders for physics (WebGPU future)

### Type Definitions

```typescript
// packages/core/src/types/three.ts

export interface ParticleSystemConfig {
  id: string;
  
  /** Maximum particle count */
  count: number;
  
  /** Emitter configuration */
  emitter: ParticleEmitter;
  
  /** Particle properties */
  particle: ParticleProperties;
  
  /** Forces affecting particles */
  forces?: ParticleForce[];
  
  /** Collision with scene geometry */
  collision?: {
    enabled: boolean;
    bounce?: number; // Restitution
    friction?: number;
  };
  
  /** Rendering options */
  rendering?: {
    blending?: 'normal' | 'additive' | 'multiply';
    depthWrite?: boolean;
    texture?: string; // URL or data URI
    textureAtlas?: {
      columns: number;
      rows: number;
      randomFrame?: boolean;
    };
  };
}

export type ParticleEmitter = 
  | PointEmitter
  | SphereEmitter
  | BoxEmitter
  | ConeEmitter
  | MeshEmitter;

interface PointEmitter {
  type: 'point';
  position: [number, number, number];
  rate?: number; // Particles per second
  burst?: ParticleBurst[];
}

interface SphereEmitter {
  type: 'sphere';
  position: [number, number, number];
  radius: number;
  emitFromShell?: boolean; // Only from surface
  rate?: number;
  burst?: ParticleBurst[];
}

interface BoxEmitter {
  type: 'box';
  position: [number, number, number];
  size: [number, number, number];
  rate?: number;
  burst?: ParticleBurst[];
}

interface ConeEmitter {
  type: 'cone';
  position: [number, number, number];
  direction: [number, number, number];
  angle: number; // Cone angle in radians
  radius: number;
  rate?: number;
  burst?: ParticleBurst[];
}

interface MeshEmitter {
  type: 'mesh';
  meshId: string; // Reference to existing mesh
  emitFromVertices?: boolean;
  emitFromFaces?: boolean;
  rate?: number;
  burst?: ParticleBurst[];
}

interface ParticleBurst {
  frame: number; // When to burst
  count: number; // How many particles
}

export interface ParticleProperties {
  /** Particle lifetime in seconds */
  lifetime: number | { min: number; max: number };
  
  /** Initial velocity */
  velocity?: {
    min: [number, number, number];
    max: [number, number, number];
  };
  
  /** Size over lifetime */
  size: number | { start: number; end: number } | ParticleCurve;
  
  /** Color over lifetime */
  color: string | { start: string; end: string } | ParticleCurve;
  
  /** Opacity over lifetime */
  opacity?: number | { start: number; end: number } | ParticleCurve;
  
  /** Rotation speed (radians per second) */
  rotation?: number | { min: number; max: number };
  
  /** Drag coefficient */
  drag?: number;
}

interface ParticleCurve {
  curve: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  keyframes: Array<{ time: number; value: number | string }>;
}

export type ParticleForce = 
  | { type: 'gravity'; strength: number }
  | { type: 'wind'; direction: [number, number, number]; strength: number }
  | { type: 'turbulence'; strength: number; frequency: number }
  | { type: 'attraction'; position: [number, number, number]; strength: number; radius: number }
  | { type: 'vortex'; position: [number, number, number]; axis: [number, number, number]; strength: number };
```

### Shader Implementation

```glsl
// Vertex Shader
attribute vec3 particlePosition;
attribute vec3 particleVelocity;
attribute float particleAge;
attribute float particleLifetime;
attribute float particleSize;
attribute vec4 particleColor;
attribute float particleRotation;

uniform float time;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;
varying vec2 vUv;
varying float vAge;

void main() {
  vAge = particleAge / particleLifetime;
  vColor = particleColor;
  vUv = uv;
  
  // Billboard rotation
  vec3 pos = particlePosition;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Apply rotation
  float c = cos(particleRotation);
  float s = sin(particleRotation);
  vec2 rotatedPosition = vec2(
    position.x * c - position.y * s,
    position.x * s + position.y * c
  );
  
  mvPosition.xy += rotatedPosition * particleSize;
  
  gl_Position = projectionMatrix * mvPosition;
}
```

```glsl
// Fragment Shader
uniform sampler2D particleTexture;
uniform bool useTexture;

varying vec4 vColor;
varying vec2 vUv;
varying float vAge;

void main() {
  vec4 texColor = useTexture ? texture2D(particleTexture, vUv) : vec4(1.0);
  
  // Fade out at end of life
  float alpha = vColor.a * texColor.a * (1.0 - vAge);
  
  gl_FragColor = vec4(vColor.rgb * texColor.rgb, alpha);
  
  if (gl_FragColor.a < 0.01) discard;
}
```

### CPU Update Loop

```typescript
// packages/renderer-browser/src/layers/three/particles/ParticleSystem.ts

export class ParticleSystem {
  private particles: Particle[] = [];
  private geometry: InstancedBufferGeometry;
  private material: ShaderMaterial;
  private mesh: InstancedMesh;
  
  constructor(config: ParticleSystemConfig) {
    this.initGeometry(config.count);
    this.initMaterial(config.rendering);
    this.mesh = new InstancedMesh(this.geometry, this.material, config.count);
  }
  
  update(deltaTime: number, frame: number) {
    // Update existing particles
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      if (particle.age >= particle.lifetime) {
        this.recycleParticle(i);
        continue;
      }
      
      // Apply forces
      for (const force of this.config.forces || []) {
        this.applyForce(particle, force, deltaTime);
      }
      
      // Update position
      particle.position.addScaledVector(particle.velocity, deltaTime);
      particle.velocity.multiplyScalar(1 - particle.drag * deltaTime);
      
      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime;
      
      // Update age
      particle.age += deltaTime;
      
      // Update attributes
      this.updateParticleAttributes(i, particle);
    }
    
    // Emit new particles
    this.emit(deltaTime, frame);
    
    // Update GPU buffers
    this.geometry.attributes.particlePosition.needsUpdate = true;
    this.geometry.attributes.particleColor.needsUpdate = true;
    // ... other attributes
  }
  
  private applyForce(particle: Particle, force: ParticleForce, deltaTime: number) {
    switch (force.type) {
      case 'gravity':
        particle.velocity.y -= force.strength * deltaTime;
        break;
      case 'wind':
        particle.velocity.addScaledVector(
          new Vector3(...force.direction).normalize(),
          force.strength * deltaTime
        );
        break;
      case 'turbulence':
        const noise = this.turbulenceNoise(particle.position, force.frequency);
        particle.velocity.addScaledVector(noise, force.strength * deltaTime);
        break;
      // ... other forces
    }
  }
  
  private emit(deltaTime: number, frame: number) {
    // Continuous emission
    if (this.config.emitter.rate) {
      const count = this.config.emitter.rate * deltaTime;
      for (let i = 0; i < Math.floor(count); i++) {
        this.spawnParticle();
      }
    }
    
    // Burst emission
    for (const burst of this.config.emitter.burst || []) {
      if (frame === burst.frame) {
        for (let i = 0; i < burst.count; i++) {
          this.spawnParticle();
        }
      }
    }
  }
  
  private spawnParticle() {
    const particle = this.getRecycledParticle();
    
    // Set initial position based on emitter type
    particle.position.copy(this.getEmitterPosition());
    
    // Set initial velocity
    particle.velocity.copy(this.getInitialVelocity());
    
    // Set properties
    particle.age = 0;
    particle.lifetime = this.getLifetime();
    particle.size = this.getSize(0);
    particle.color.copy(this.getColor(0));
    particle.rotation = Math.random() * Math.PI * 2;
    particle.rotationSpeed = this.getRotationSpeed();
    
    this.particles.push(particle);
  }
}
```

## Implementation Checklist

### Phase 1: Core Particle System
- [ ] Create `ParticleSystem` class
- [ ] Implement instanced rendering
- [ ] Create particle shaders (vertex + fragment)
- [ ] Implement particle lifecycle (spawn, update, recycle)
- [ ] Add particle pooling for performance

### Phase 2: Emitters
- [ ] Implement point emitter
- [ ] Implement sphere emitter
- [ ] Implement box emitter
- [ ] Implement cone emitter
- [ ] Implement mesh surface emitter
- [ ] Add burst emission
- [ ] Add continuous emission

### Phase 3: Forces
- [ ] Implement gravity force
- [ ] Implement wind force
- [ ] Implement turbulence (Perlin noise)
- [ ] Implement attraction/repulsion
- [ ] Implement vortex force

### Phase 4: Advanced Features
- [ ] Particle collision with scene geometry
- [ ] Texture atlas support
- [ ] Color gradients over lifetime
- [ ] Size curves over lifetime
- [ ] Additive/multiply blending modes
- [ ] Soft particles (depth fade)

### Phase 5: React Integration
- [ ] Create `ParticleSystem` React component
- [ ] Integrate with `ThreeLayer`
- [ ] Add particle system to scene context
- [ ] Support dynamic spawning from collision events

### Phase 6: Testing
- [ ] Unit tests for particle lifecycle
- [ ] Test all emitter types
- [ ] Test all force types
- [ ] Performance tests (10k, 50k, 100k particles)
- [ ] Memory leak tests

### Phase 7: Documentation & Examples
- [ ] Particle system guide
- [ ] Example: Explosion effect
- [ ] Example: Fire and smoke
- [ ] Example: Magic spell trail
- [ ] Example: Confetti celebration
- [ ] Example: Rain/snow weather

## API Design

```json
{
  "type": "three",
  "props": {
    "particles": [
      {
        "id": "explosion",
        "count": 10000,
        "emitter": {
          "type": "sphere",
          "position": [0, 2, 0],
          "radius": 0.5,
          "burst": [
            { "frame": 60, "count": 5000 }
          ]
        },
        "particle": {
          "lifetime": { "min": 1, "max": 3 },
          "velocity": {
            "min": [-10, 0, -10],
            "max": [10, 20, 10]
          },
          "size": { "start": 0.3, "end": 0.05 },
          "color": { "start": "#ff6b6b", "end": "#ffd43b" },
          "opacity": { "start": 1, "end": 0 },
          "drag": 0.5
        },
        "forces": [
          { "type": "gravity", "strength": 9.81 },
          { "type": "turbulence", "strength": 2, "frequency": 0.5 }
        ],
        "rendering": {
          "blending": "additive",
          "texture": "particle.png"
        }
      }
    ]
  }
}
```

## Dependencies
- #GAMING-002 (for Three.js integration)

## Acceptance Criteria
- [ ] Can render 10,000+ particles at 60fps
- [ ] All emitter types work correctly
- [ ] All force types work correctly
- [ ] Particle lifecycle is deterministic
- [ ] No memory leaks
- [ ] Works in browser and Node.js
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-002 (Three.js integration)
- #GAMING-003 (collision events can spawn particles)

## Notes
- Consider WebGPU compute shaders for future optimization
- Add LOD system (reduce particle count at distance)
- Support particle trails (ribbon particles)
- Consider soft particle depth fade for better blending
