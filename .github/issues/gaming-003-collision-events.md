# [GAMING-003] Physics Collision Events and Callbacks

## Overview
Add collision event system to physics-enabled meshes, allowing templates to trigger actions (spawn particles, play sounds, change materials) when objects collide.

## Motivation
Collision events are essential for game-like interactions: explosions on impact, sound effects, visual feedback, and triggering animations. This makes physics simulations feel responsive and alive.

## Technical Approach

### Type Extensions

```typescript
// packages/core/src/types/three.ts

export interface CollisionEvent {
  type: 'collisionStart' | 'collisionEnd';
  otherMesh: string; // ID of the other mesh
  impulse: number; // Collision impulse magnitude
  point: [number, number, number]; // Contact point
  normal: [number, number, number]; // Contact normal
}

export interface ThreeMeshConfig {
  // ... existing properties
  
  /** Collision event handlers */
  collisionEvents?: {
    /** Triggered when collision starts */
    onCollisionStart?: CollisionAction[];
    /** Triggered when collision ends */
    onCollisionEnd?: CollisionAction[];
    /** Minimum impulse to trigger events (filters small collisions) */
    impulseThreshold?: number;
  };
}

export type CollisionAction = 
  | { type: 'spawnParticles'; particleId: string; count?: number }
  | { type: 'playSound'; soundId: string; volume?: number }
  | { type: 'changeMaterial'; material: ThreeMaterialConfig }
  | { type: 'applyForce'; force: [number, number, number] }
  | { type: 'destroy'; delay?: number }
  | { type: 'script'; code: string };
```

### Implementation

```typescript
// packages/physics/src/CollisionEventSystem.ts

export class CollisionEventSystem {
  private listeners = new Map<string, CollisionListener[]>();
  
  addListener(bodyId: string, listener: CollisionListener) {
    if (!this.listeners.has(bodyId)) {
      this.listeners.set(bodyId, []);
    }
    this.listeners.get(bodyId)!.push(listener);
  }
  
  removeListener(bodyId: string, listener: CollisionListener) {
    const listeners = this.listeners.get(bodyId);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    }
  }
  
  handleCollision(event: CollisionEvent) {
    const listeners = this.listeners.get(event.bodyId);
    if (!listeners) return;
    
    for (const listener of listeners) {
      if (event.impulse >= listener.impulseThreshold) {
        listener.callback(event);
      }
    }
  }
}

interface CollisionListener {
  impulseThreshold: number;
  callback: (event: CollisionEvent) => void;
}
```

```typescript
// packages/renderer-browser/src/layers/three/CollisionHandler.tsx

export function useCollisionEvents(
  meshId: string,
  rigidBody: RigidBody | null,
  config: ThreeMeshConfig['collisionEvents'],
  actions: CollisionActionHandlers
) {
  const physics = usePhysics();
  
  useEffect(() => {
    if (!physics || !rigidBody || !config) return;
    
    const handleCollisionStart = (event: CollisionEvent) => {
      config.onCollisionStart?.forEach(action => {
        executeAction(action, event, actions);
      });
    };
    
    const handleCollisionEnd = (event: CollisionEvent) => {
      config.onCollisionEnd?.forEach(action => {
        executeAction(action, event, actions);
      });
    };
    
    physics.collisionEvents.addListener(rigidBody.id, {
      impulseThreshold: config.impulseThreshold || 0,
      callback: handleCollisionStart
    });
    
    return () => {
      physics.collisionEvents.removeListener(rigidBody.id, handleCollisionStart);
    };
  }, [physics, rigidBody, config]);
}

function executeAction(
  action: CollisionAction,
  event: CollisionEvent,
  handlers: CollisionActionHandlers
) {
  switch (action.type) {
    case 'spawnParticles':
      handlers.spawnParticles(action.particleId, event.point, action.count);
      break;
    case 'playSound':
      handlers.playSound(action.soundId, action.volume);
      break;
    case 'changeMaterial':
      handlers.changeMaterial(event.bodyId, action.material);
      break;
    case 'applyForce':
      handlers.applyForce(event.bodyId, action.force);
      break;
    case 'destroy':
      handlers.destroy(event.bodyId, action.delay);
      break;
    case 'script':
      handlers.executeScript(action.code, event);
      break;
  }
}
```

## Implementation Checklist

### Phase 1: Core Event System
- [ ] Implement `CollisionEventSystem` in `@rendervid/physics`
- [ ] Add collision detection to Rapier integration
- [ ] Calculate impulse magnitude from collision data
- [ ] Add event filtering (impulse threshold)

### Phase 2: Type Definitions
- [ ] Add `collisionEvents` to `ThreeMeshConfig`
- [ ] Define `CollisionAction` types
- [ ] Update schema validation

### Phase 3: Action Handlers
- [ ] Implement `spawnParticles` action
- [ ] Implement `playSound` action (requires audio system)
- [ ] Implement `changeMaterial` action
- [ ] Implement `applyForce` action
- [ ] Implement `destroy` action
- [ ] Implement `script` action (requires scripting system)

### Phase 4: React Integration
- [ ] Create `useCollisionEvents` hook
- [ ] Integrate with `PhysicsMesh` component
- [ ] Add collision visualization (debug mode)

### Phase 5: Testing
- [ ] Unit tests for event system
- [ ] Integration tests for each action type
- [ ] Test impulse threshold filtering
- [ ] Test multiple simultaneous collisions
- [ ] Performance tests (many collision events)

### Phase 6: Documentation & Examples
- [ ] Document collision event system
- [ ] Example: Ball bouncing with sound
- [ ] Example: Box breaking on impact
- [ ] Example: Particle explosion on collision
- [ ] Example: Chain reaction (dominos)

## API Design

```json
{
  "type": "three",
  "props": {
    "physics": { "enabled": true },
    "particles": [
      {
        "id": "impact-particles",
        "count": 1000,
        "particle": {
          "lifetime": 1,
          "size": 0.1,
          "color": "#ff6b6b"
        }
      }
    ],
    "meshes": [
      {
        "id": "ball",
        "geometry": { "type": "sphere", "radius": 0.5 },
        "position": [0, 5, 0],
        "rigidBody": {
          "type": "dynamic",
          "mass": 1,
          "restitution": 0.8
        },
        "collider": { "type": "sphere" },
        "collisionEvents": {
          "impulseThreshold": 5,
          "onCollisionStart": [
            {
              "type": "spawnParticles",
              "particleId": "impact-particles",
              "count": 50
            },
            {
              "type": "playSound",
              "soundId": "bounce",
              "volume": 0.8
            }
          ]
        }
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

### Advanced Example: Destructible Object

```json
{
  "meshes": [
    {
      "id": "glass-box",
      "geometry": { "type": "box" },
      "material": { "type": "physical", "transmission": 0.9 },
      "position": [0, 2, 0],
      "rigidBody": { "type": "dynamic", "mass": 0.5 },
      "collider": { "type": "cuboid" },
      "collisionEvents": {
        "impulseThreshold": 10,
        "onCollisionStart": [
          {
            "type": "spawnParticles",
            "particleId": "glass-shards",
            "count": 200
          },
          {
            "type": "playSound",
            "soundId": "glass-break"
          },
          {
            "type": "destroy",
            "delay": 0
          }
        ]
      }
    }
  ]
}
```

## Dependencies
- #GAMING-002 (must be completed first)
- #GAMING-004 (for particle spawning)
- #GAMING-007 (for script actions)

## Acceptance Criteria
- [ ] Collision events fire reliably
- [ ] Impulse threshold filtering works
- [ ] All action types implemented
- [ ] No performance impact with many collisions
- [ ] Events work in both browser and Node.js
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 3 example templates

## Related Issues
- #GAMING-002 (dependency)
- #GAMING-004 (particle system)
- #GAMING-007 (scripting)

## Notes
- Consider debouncing rapid collision events
- Add option to limit events per second per object
- Collision events should be deterministic for reproducible renders
