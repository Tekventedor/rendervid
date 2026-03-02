# [GAMING-001] Create @rendervid/physics Package Foundation

## Overview
Create a new package `@rendervid/physics` that provides a unified interface for physics engines (3D and 2D) with Rapier3D as the initial implementation.

## Motivation
Enable dynamic physics simulations in video templates for game-like effects: falling objects, collisions, explosions, ragdolls, and destruction. Physics is foundational for realistic game-style videos.

## Technical Approach

### Package Structure
```
packages/physics/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── engines/
│   │   ├── rapier3d/
│   │   │   ├── RapierPhysicsEngine.ts
│   │   │   ├── RigidBody.ts
│   │   │   ├── Collider.ts
│   │   │   └── World.ts
│   │   └── matter2d/           # Future: 2D physics
│   ├── utils/
│   │   ├── conversion.ts       # Three.js <-> Rapier conversions
│   │   └── debug.ts            # Debug visualization
│   └── __tests__/
├── package.json
└── tsconfig.json
```

### Core Interfaces

```typescript
// types.ts
export interface PhysicsEngine {
  init(): Promise<void>;
  step(deltaTime: number): void;
  createRigidBody(config: RigidBodyConfig): RigidBody;
  createCollider(config: ColliderConfig): Collider;
  raycast(origin: Vector3, direction: Vector3, maxDistance: number): RaycastHit | null;
  destroy(): void;
}

export interface RigidBodyConfig {
  type: 'dynamic' | 'static' | 'kinematic';
  position?: [number, number, number];
  rotation?: [number, number, number, number]; // quaternion
  mass?: number;
  linearVelocity?: [number, number, number];
  angularVelocity?: [number, number, number];
  linearDamping?: number;
  angularDamping?: number;
  gravityScale?: number;
  canSleep?: boolean;
  ccd?: boolean; // Continuous collision detection
}

export interface ColliderConfig {
  type: 'cuboid' | 'sphere' | 'capsule' | 'cylinder' | 'cone' | 'trimesh' | 'heightfield';
  // Type-specific properties
  halfExtents?: [number, number, number]; // cuboid
  radius?: number; // sphere, capsule, cylinder
  halfHeight?: number; // capsule, cylinder
  vertices?: number[]; // trimesh
  indices?: number[]; // trimesh
  // Physics properties
  friction?: number;
  restitution?: number;
  density?: number;
  isSensor?: boolean;
  collisionGroups?: number;
  solverGroups?: number;
}

export interface RigidBody {
  id: string;
  setPosition(position: [number, number, number]): void;
  setRotation(rotation: [number, number, number, number]): void;
  setLinearVelocity(velocity: [number, number, number]): void;
  setAngularVelocity(velocity: [number, number, number]): void;
  applyImpulse(impulse: [number, number, number], point?: [number, number, number]): void;
  applyForce(force: [number, number, number], point?: [number, number, number]): void;
  applyTorque(torque: [number, number, number]): void;
  getPosition(): [number, number, number];
  getRotation(): [number, number, number, number];
  getLinearVelocity(): [number, number, number];
  getAngularVelocity(): [number, number, number];
  setEnabled(enabled: boolean): void;
  destroy(): void;
}

export interface Collider {
  id: string;
  setFriction(friction: number): void;
  setRestitution(restitution: number): void;
  setEnabled(enabled: boolean): void;
  destroy(): void;
}

export interface RaycastHit {
  point: [number, number, number];
  normal: [number, number, number];
  distance: number;
  rigidBody: RigidBody;
}

export interface PhysicsWorldConfig {
  gravity: [number, number, number];
  timestep?: number; // Fixed timestep (default: 1/60)
  maxSubsteps?: number; // Max physics steps per frame
}
```

## Implementation Checklist

### Phase 1: Core Package Setup
- [ ] Create `packages/physics` directory
- [ ] Setup package.json with dependencies:
  - `@dimforge/rapier3d-compat` (^0.11.0)
  - `@rendervid/core` (workspace:*)
- [ ] Setup TypeScript configuration
- [ ] Create core type definitions

### Phase 2: Rapier3D Integration
- [ ] Implement `RapierPhysicsEngine` class
- [ ] Implement `RapierRigidBody` wrapper
- [ ] Implement `RapierCollider` wrapper
- [ ] Add coordinate system conversion utilities (Three.js uses Y-up, Rapier uses Y-up but different handedness)
- [ ] Implement raycast functionality
- [ ] Add collision event system

### Phase 3: Testing
- [ ] Unit tests for RigidBody creation and manipulation
- [ ] Unit tests for Collider creation
- [ ] Integration tests for physics simulation
- [ ] Test collision detection
- [ ] Test raycast functionality
- [ ] Performance benchmarks (1000+ bodies)

### Phase 4: Documentation
- [ ] API documentation (JSDoc)
- [ ] Usage guide in `/docs/physics/`
- [ ] Physics concepts primer (rigid bodies, colliders, forces)
- [ ] Performance optimization guide

## API Design

```typescript
// Usage example
import { createPhysicsEngine } from '@rendervid/physics';

const physics = createPhysicsEngine('rapier3d', {
  gravity: [0, -9.81, 0],
  timestep: 1/60
});

await physics.init();

// Create a dynamic box
const body = physics.createRigidBody({
  type: 'dynamic',
  position: [0, 5, 0],
  mass: 1
});

const collider = physics.createCollider({
  type: 'cuboid',
  halfExtents: [0.5, 0.5, 0.5],
  friction: 0.5,
  restitution: 0.8
});

body.attachCollider(collider);

// Simulate
physics.step(1/60);

// Get updated position
const position = body.getPosition();
```

## Dependencies
None (foundational package)

## Acceptance Criteria
- [ ] Package builds without errors
- [ ] All tests pass with >90% coverage
- [ ] Can create and simulate 1000+ rigid bodies at 60fps
- [ ] Collision detection works accurately
- [ ] Memory usage is stable (no leaks)
- [ ] Documentation is complete and clear

## Related Issues
- #GAMING-002 (depends on this)
- #GAMING-003 (depends on this)

## Notes
- Use `@dimforge/rapier3d-compat` for better browser/Node.js compatibility
- Consider lazy-loading Rapier WASM module to reduce bundle size
- Plan for future 2D physics engine (Matter.js) with same interface
