# [GAMING-002] Integrate Physics into Three.js Layer

## Overview
Extend the existing `ThreeLayer` to support physics simulation using the `@rendervid/physics` package. Add rigid body and collider configuration to mesh definitions.

## Motivation
Enable physics-based animations in Three.js scenes: objects falling, bouncing, colliding, and reacting to forces. This transforms static 3D scenes into dynamic game-like environments.

## Technical Approach

### Type Extensions

```typescript
// packages/core/src/types/three.ts

export interface ThreeMeshConfig {
  // ... existing properties
  
  /** Physics rigid body configuration */
  rigidBody?: {
    type: 'dynamic' | 'static' | 'kinematic';
    mass?: number;
    linearVelocity?: [number, number, number];
    angularVelocity?: [number, number, number];
    linearDamping?: number;
    angularDamping?: number;
    gravityScale?: number;
    canSleep?: boolean;
    ccd?: boolean;
  };
  
  /** Physics collider configuration */
  collider?: {
    type: 'cuboid' | 'sphere' | 'capsule' | 'cylinder' | 'cone' | 'trimesh';
    // Auto-generated from geometry if not specified
    halfExtents?: [number, number, number];
    radius?: number;
    halfHeight?: number;
    friction?: number;
    restitution?: number;
    density?: number;
    isSensor?: boolean;
  };
}

export interface ThreeLayerProps {
  // ... existing properties
  
  /** Physics world configuration */
  physics?: {
    enabled: boolean;
    gravity?: [number, number, number];
    timestep?: number;
    debug?: boolean; // Show collision shapes
  };
}
```

### Implementation in Renderer

```typescript
// packages/renderer-browser/src/layers/three/PhysicsWorld.tsx

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { createPhysicsEngine } from '@rendervid/physics';
import type { ThreeLayerProps } from '@rendervid/core';

export function PhysicsWorld({ 
  config, 
  children 
}: { 
  config: ThreeLayerProps['physics']; 
  children: React.ReactNode;
}) {
  const physicsRef = useRef<PhysicsEngine | null>(null);
  
  useEffect(() => {
    if (!config?.enabled) return;
    
    const physics = createPhysicsEngine('rapier3d', {
      gravity: config.gravity || [0, -9.81, 0],
      timestep: config.timestep || 1/60
    });
    
    physics.init().then(() => {
      physicsRef.current = physics;
    });
    
    return () => {
      physics.destroy();
    };
  }, [config]);
  
  useFrame((state, delta) => {
    if (physicsRef.current) {
      physicsRef.current.step(delta);
    }
  });
  
  return <>{children}</>;
}
```

```typescript
// packages/renderer-browser/src/layers/three/PhysicsMesh.tsx

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { RigidBody } from '@rendervid/physics';
import { usePhysics } from './PhysicsContext';

export function PhysicsMesh({ 
  mesh, 
  rigidBodyConfig, 
  colliderConfig,
  children 
}: PhysicsMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const rigidBodyRef = useRef<RigidBody | null>(null);
  const physics = usePhysics();
  
  useEffect(() => {
    if (!physics || !meshRef.current) return;
    
    // Create rigid body
    const body = physics.createRigidBody({
      type: rigidBodyConfig.type,
      position: mesh.position.toArray(),
      rotation: mesh.quaternion.toArray(),
      ...rigidBodyConfig
    });
    
    // Create collider (auto-generate from geometry if not specified)
    const collider = physics.createCollider({
      type: colliderConfig?.type || inferColliderType(mesh.geometry),
      ...generateColliderParams(mesh.geometry, colliderConfig),
      ...colliderConfig
    });
    
    body.attachCollider(collider);
    rigidBodyRef.current = body;
    
    return () => {
      body.destroy();
    };
  }, [physics, rigidBodyConfig, colliderConfig]);
  
  // Sync Three.js mesh with physics body
  useFrame(() => {
    if (rigidBodyRef.current && meshRef.current) {
      const position = rigidBodyRef.current.getPosition();
      const rotation = rigidBodyRef.current.getRotation();
      
      meshRef.current.position.set(...position);
      meshRef.current.quaternion.set(...rotation);
    }
  });
  
  return (
    <mesh ref={meshRef}>
      {children}
    </mesh>
  );
}
```

## Implementation Checklist

### Phase 1: Type Definitions
- [ ] Add `rigidBody` and `collider` to `ThreeMeshConfig`
- [ ] Add `physics` to `ThreeLayerProps`
- [ ] Update schema validation in `@rendervid/core`

### Phase 2: Physics Integration
- [ ] Create `PhysicsContext` for sharing physics engine
- [ ] Implement `PhysicsWorld` component
- [ ] Implement `PhysicsMesh` component
- [ ] Add collider auto-generation from geometry
- [ ] Implement position/rotation sync (physics → Three.js)
- [ ] Add debug visualization (wireframe colliders)

### Phase 3: Advanced Features
- [ ] Collision event callbacks
- [ ] Apply forces/impulses via animations
- [ ] Joints and constraints support
- [ ] Compound colliders (multiple colliders per body)
- [ ] Collision filtering (groups/layers)

### Phase 4: Testing
- [ ] Unit tests for type validation
- [ ] Integration tests with physics simulation
- [ ] Test all collider types
- [ ] Test collision detection
- [ ] Performance tests (100+ physics bodies)

### Phase 5: Documentation & Examples
- [ ] Update Three.js layer documentation
- [ ] Create physics guide in `/docs/physics/`
- [ ] Example: Falling boxes
- [ ] Example: Bouncing balls
- [ ] Example: Domino effect
- [ ] Example: Product drop showcase

## API Design

```json
{
  "type": "three",
  "props": {
    "physics": {
      "enabled": true,
      "gravity": [0, -9.81, 0],
      "debug": false
    },
    "meshes": [
      {
        "id": "dynamic-box",
        "geometry": { "type": "box", "width": 1, "height": 1, "depth": 1 },
        "material": { "type": "standard", "color": "#ff0000" },
        "position": [0, 5, 0],
        "rigidBody": {
          "type": "dynamic",
          "mass": 1,
          "restitution": 0.8,
          "friction": 0.5
        },
        "collider": {
          "type": "cuboid"
        }
      },
      {
        "id": "ground",
        "geometry": { "type": "plane", "width": 20, "height": 20 },
        "material": { "type": "standard", "color": "#808080" },
        "position": [0, 0, 0],
        "rotation": [-1.5708, 0, 0],
        "rigidBody": {
          "type": "static"
        },
        "collider": {
          "type": "cuboid"
        }
      }
    ]
  }
}
```

## Dependencies
- #GAMING-001 (must be completed first)

## Acceptance Criteria
- [ ] Physics simulation works in browser renderer
- [ ] Physics simulation works in Node.js renderer
- [ ] All collider types supported
- [ ] Position/rotation sync is accurate
- [ ] No performance degradation with 100+ bodies
- [ ] Debug visualization works
- [ ] All tests pass
- [ ] Documentation is complete
- [ ] At least 3 example templates created

## Related Issues
- #GAMING-001 (dependency)
- #GAMING-003 (collision events)
- #GAMING-007 (scripting integration)

## Notes
- Consider using `useImperativeHandle` for external control of physics bodies
- Implement object pooling for better performance
- Add option to disable physics after N frames (for static final state)
