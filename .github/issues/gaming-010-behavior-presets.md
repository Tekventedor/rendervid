# [GAMING-010] Behavior Preset Library

## Overview
Create a library of reusable, AI-friendly behavior presets that can be applied to meshes and sprites without custom scripting.

## Motivation
Make game-like behaviors accessible to AI agents and non-programmers. Presets provide safe, tested, parameterized behaviors that work out of the box.

## Technical Approach

Create a behavior system where behaviors are JSON-configurable functions with parameters. Behaviors can be combined and chained.

### Type Definitions

```typescript
// packages/core/src/types/behaviors.ts

export interface BehaviorConfig {
  /** Behavior type */
  type: string;
  
  /** Behavior parameters */
  params?: Record<string, any>;
  
  /** When to start (frame number) */
  startFrame?: number;
  
  /** When to end (frame number) */
  endFrame?: number;
  
  /** Loop behavior */
  loop?: boolean;
  
  /** Priority (higher = runs first) */
  priority?: number;
}

export interface ThreeMeshConfig {
  // ... existing properties
  
  /** Behavior presets */
  behaviors?: BehaviorConfig[];
}

export interface PixiSprite {
  // ... existing properties
  
  /** Behavior presets */
  behaviors?: BehaviorConfig[];
}
```

### Behavior Presets

```typescript
// packages/behaviors/src/presets/index.ts

export const BEHAVIOR_PRESETS = {
  // Movement behaviors
  orbit: {
    description: 'Orbit around a point',
    params: {
      center: { type: 'vector3', default: [0, 0, 0] },
      radius: { type: 'number', default: 5 },
      speed: { type: 'number', default: 0.02 },
      axis: { type: 'vector3', default: [0, 1, 0] },
      startAngle: { type: 'number', default: 0 },
    },
    execute: (mesh, params, time) => {
      const angle = params.startAngle + time.frame * params.speed;
      const x = params.center[0] + Math.cos(angle) * params.radius;
      const z = params.center[2] + Math.sin(angle) * params.radius;
      mesh.setPosition([x, params.center[1], z]);
    },
  },
  
  follow: {
    description: 'Follow another object',
    params: {
      target: { type: 'string', required: true },
      distance: { type: 'number', default: 2 },
      speed: { type: 'number', default: 0.1 },
      smoothing: { type: 'number', default: 0.1 },
    },
    execute: (mesh, params, time, scene) => {
      const target = scene.getById(params.target);
      if (!target) return;
      
      const direction = math.vec3.subtract(target.position, mesh.position);
      const currentDistance = math.vec3.length(direction);
      
      if (currentDistance > params.distance) {
        const normalized = math.vec3.normalize(direction);
        const movement = math.vec3.multiply(normalized, params.speed);
        const newPos = math.vec3.add(mesh.position, movement);
        mesh.setPosition(newPos);
      }
    },
  },
  
  lookAt: {
    description: 'Always look at a target',
    params: {
      target: { type: 'string', required: true },
      axis: { type: 'vector3', default: [0, 1, 0] },
    },
    execute: (mesh, params, time, scene) => {
      const target = scene.getById(params.target);
      if (!target) return;
      
      // Calculate rotation to face target
      const direction = math.vec3.subtract(target.position, mesh.position);
      const angle = Math.atan2(direction[0], direction[2]);
      mesh.setRotation([0, angle, 0]);
    },
  },
  
  bounce: {
    description: 'Bounce up and down',
    params: {
      height: { type: 'number', default: 2 },
      speed: { type: 'number', default: 1 },
      easing: { type: 'string', default: 'easeInOutQuad' },
    },
    execute: (mesh, params, time) => {
      const t = (Math.sin(time.frame * params.speed * 0.1) + 1) / 2;
      const easedT = applyEasing(t, params.easing);
      const y = mesh.position[1] + easedT * params.height;
      mesh.setPosition([mesh.position[0], y, mesh.position[2]]);
    },
  },
  
  patrol: {
    description: 'Move between waypoints',
    params: {
      waypoints: { type: 'array', required: true },
      speed: { type: 'number', default: 0.1 },
      loop: { type: 'boolean', default: true },
      pauseTime: { type: 'number', default: 30 },
    },
    state: {
      currentWaypoint: 0,
      pauseFrames: 0,
    },
    execute: (mesh, params, time, scene, state) => {
      if (state.pauseFrames > 0) {
        state.pauseFrames--;
        return;
      }
      
      const target = params.waypoints[state.currentWaypoint];
      const distance = math.vec3.distance(mesh.position, target);
      
      if (distance < 0.1) {
        state.currentWaypoint++;
        if (state.currentWaypoint >= params.waypoints.length) {
          if (params.loop) {
            state.currentWaypoint = 0;
          } else {
            return;
          }
        }
        state.pauseFrames = params.pauseTime;
      } else {
        const direction = math.vec3.normalize(math.vec3.subtract(target, mesh.position));
        const movement = math.vec3.multiply(direction, params.speed);
        mesh.setPosition(math.vec3.add(mesh.position, movement));
      }
    },
  },
  
  // Physics behaviors
  explodeOnImpact: {
    description: 'Explode when collision impulse exceeds threshold',
    params: {
      impulseThreshold: { type: 'number', default: 5 },
      particleSystem: { type: 'string', required: true },
      particleCount: { type: 'number', default: 100 },
      destroyOnExplode: { type: 'boolean', default: true },
    },
    triggers: ['collision'],
    execute: (mesh, params, time, scene, state, event) => {
      if (event.type === 'collision' && event.impulse > params.impulseThreshold) {
        scene.particles.burst(params.particleSystem, mesh.position, params.particleCount);
        if (params.destroyOnExplode) {
          mesh.destroy();
        }
      }
    },
  },
  
  applyForceOnTrigger: {
    description: 'Apply force when triggered',
    params: {
      triggerFrame: { type: 'number', required: true },
      force: { type: 'vector3', required: true },
      point: { type: 'vector3', default: null },
    },
    execute: (mesh, params, time, scene) => {
      if (time.frame === params.triggerFrame) {
        scene.physics.applyForce(mesh.id, params.force, params.point);
      }
    },
  },
  
  // Animation behaviors
  pulse: {
    description: 'Pulse scale in and out',
    params: {
      minScale: { type: 'number', default: 0.8 },
      maxScale: { type: 'number', default: 1.2 },
      speed: { type: 'number', default: 1 },
    },
    execute: (mesh, params, time) => {
      const t = (Math.sin(time.frame * params.speed * 0.1) + 1) / 2;
      const scale = params.minScale + (params.maxScale - params.minScale) * t;
      mesh.setScale([scale, scale, scale]);
    },
  },
  
  spin: {
    description: 'Continuous rotation',
    params: {
      axis: { type: 'string', default: 'y' },
      speed: { type: 'number', default: 0.02 },
    },
    execute: (mesh, params, time) => {
      const rotation = [...mesh.rotation];
      const axisIndex = { x: 0, y: 1, z: 2 }[params.axis];
      rotation[axisIndex] += params.speed;
      mesh.setRotation(rotation);
    },
  },
  
  fadeInOut: {
    description: 'Fade opacity in and out',
    params: {
      minOpacity: { type: 'number', default: 0 },
      maxOpacity: { type: 'number', default: 1 },
      speed: { type: 'number', default: 1 },
    },
    execute: (mesh, params, time) => {
      const t = (Math.sin(time.frame * params.speed * 0.1) + 1) / 2;
      const opacity = params.minOpacity + (params.maxOpacity - params.minOpacity) * t;
      mesh.setMaterial({ opacity });
    },
  },
  
  // Procedural behaviors
  randomWalk: {
    description: 'Random movement within bounds',
    params: {
      bounds: { type: 'vector3', default: [10, 10, 10] },
      speed: { type: 'number', default: 0.1 },
      changeInterval: { type: 'number', default: 60 },
    },
    state: {
      direction: [0, 0, 0],
      framesSinceChange: 0,
    },
    execute: (mesh, params, time, scene, state) => {
      state.framesSinceChange++;
      
      if (state.framesSinceChange >= params.changeInterval) {
        state.direction = math.random.vector3([-1, -1, -1], [1, 1, 1]);
        state.direction = math.vec3.normalize(state.direction);
        state.framesSinceChange = 0;
      }
      
      const movement = math.vec3.multiply(state.direction, params.speed);
      let newPos = math.vec3.add(mesh.position, movement);
      
      // Clamp to bounds
      newPos = [
        math.clamp(newPos[0], -params.bounds[0], params.bounds[0]),
        math.clamp(newPos[1], -params.bounds[1], params.bounds[1]),
        math.clamp(newPos[2], -params.bounds[2], params.bounds[2]),
      ];
      
      mesh.setPosition(newPos);
    },
  },
  
  flocking: {
    description: 'Boids flocking behavior',
    params: {
      separationDistance: { type: 'number', default: 2 },
      alignmentDistance: { type: 'number', default: 5 },
      cohesionDistance: { type: 'number', default: 5 },
      separationWeight: { type: 'number', default: 1.5 },
      alignmentWeight: { type: 'number', default: 1.0 },
      cohesionWeight: { type: 'number', default: 1.0 },
      maxSpeed: { type: 'number', default: 0.2 },
      group: { type: 'string', default: 'flock' },
    },
    state: {
      velocity: [0, 0, 0],
    },
    execute: (mesh, params, time, scene, state) => {
      const neighbors = scene.getAll().filter(
        m => m.id !== mesh.id && m.behaviors?.some(b => b.type === 'flocking' && b.params.group === params.group)
      );
      
      // Separation, alignment, cohesion calculations
      // ... (full boids algorithm)
      
      mesh.setPosition(math.vec3.add(mesh.position, state.velocity));
    },
  },
};
```

### Behavior System

```typescript
// packages/behaviors/src/BehaviorSystem.ts

export class BehaviorSystem {
  private behaviors = new Map<string, BehaviorInstance[]>();
  private presets = BEHAVIOR_PRESETS;
  
  addBehavior(meshId: string, config: BehaviorConfig) {
    const preset = this.presets[config.type];
    if (!preset) {
      throw new Error(`Unknown behavior: ${config.type}`);
    }
    
    const instance: BehaviorInstance = {
      config,
      preset,
      state: preset.state ? { ...preset.state } : {},
      enabled: true,
    };
    
    if (!this.behaviors.has(meshId)) {
      this.behaviors.set(meshId, []);
    }
    
    this.behaviors.get(meshId)!.push(instance);
  }
  
  update(frame: number, deltaTime: number, scene: SceneAPI) {
    for (const [meshId, behaviors] of this.behaviors) {
      const mesh = scene.getById(meshId);
      if (!mesh) continue;
      
      // Sort by priority
      behaviors.sort((a, b) => (b.config.priority || 0) - (a.config.priority || 0));
      
      for (const behavior of behaviors) {
        if (!behavior.enabled) continue;
        
        // Check frame range
        if (behavior.config.startFrame && frame < behavior.config.startFrame) continue;
        if (behavior.config.endFrame && frame > behavior.config.endFrame) continue;
        
        // Execute behavior
        try {
          behavior.preset.execute(
            mesh,
            behavior.config.params || {},
            { frame, deltaTime, elapsed: frame / 60 },
            scene,
            behavior.state
          );
        } catch (error) {
          console.error(`Behavior ${behavior.config.type} error:`, error);
        }
      }
    }
  }
  
  handleEvent(meshId: string, event: any) {
    const behaviors = this.behaviors.get(meshId);
    if (!behaviors) return;
    
    for (const behavior of behaviors) {
      if (behavior.preset.triggers?.includes(event.type)) {
        behavior.preset.execute(
          scene.getById(meshId),
          behavior.config.params || {},
          { frame: event.frame, deltaTime: 0, elapsed: 0 },
          scene,
          behavior.state,
          event
        );
      }
    }
  }
}
```

## Implementation Checklist

### Phase 1: Core System
- [ ] Create `@rendervid/behaviors` package
- [ ] Implement `BehaviorSystem` class
- [ ] Add behavior registration
- [ ] Add behavior execution
- [ ] Add state management

### Phase 2: Movement Behaviors
- [ ] Implement orbit
- [ ] Implement follow
- [ ] Implement lookAt
- [ ] Implement bounce
- [ ] Implement patrol
- [ ] Implement randomWalk

### Phase 3: Physics Behaviors
- [ ] Implement explodeOnImpact
- [ ] Implement applyForceOnTrigger
- [ ] Implement attractToPoint
- [ ] Implement repelFromPoint

### Phase 4: Animation Behaviors
- [ ] Implement pulse
- [ ] Implement spin
- [ ] Implement fadeInOut
- [ ] Implement colorCycle

### Phase 5: Advanced Behaviors
- [ ] Implement flocking (boids)
- [ ] Implement pathfinding
- [ ] Implement state machine
- [ ] Implement procedural animation

### Phase 6: Integration
- [ ] Integrate with Three.js layer
- [ ] Integrate with PixiJS layer
- [ ] Add to capabilities API
- [ ] Update MCP server

### Phase 7: Testing
- [ ] Unit tests for each behavior
- [ ] Integration tests
- [ ] Test behavior combinations
- [ ] Performance tests

### Phase 8: Documentation
- [ ] Behavior library reference
- [ ] Example for each behavior
- [ ] Behavior composition guide
- [ ] Custom behavior creation guide

## API Design

```json
{
  "meshes": [{
    "id": "satellite",
    "geometry": { "type": "sphere" },
    "behaviors": [
      {
        "type": "orbit",
        "params": {
          "center": [0, 0, 0],
          "radius": 5,
          "speed": 0.02
        }
      },
      {
        "type": "pulse",
        "params": {
          "minScale": 0.9,
          "maxScale": 1.1,
          "speed": 2
        }
      }
    ]
  }]
}
```

## Dependencies
- #GAMING-002 (Three.js integration)
- #GAMING-008 (PixiJS integration)

## Acceptance Criteria
- [ ] All listed behaviors implemented
- [ ] Behaviors can be combined
- [ ] State management works
- [ ] Performance is good
- [ ] All tests pass
- [ ] Documentation complete
- [ ] AI capabilities API updated

## Related Issues
- #GAMING-007 (scripting for custom behaviors)

## Notes
- Behaviors should be deterministic for reproducible renders
- Consider visual behavior editor (future)
- Add behavior marketplace/sharing (future)
