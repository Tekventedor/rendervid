# [GAMING-009] Matter.js 2D Physics Integration

## Overview
Integrate Matter.js physics engine for 2D physics simulation in PixiJS layers, enabling realistic 2D game mechanics.

## Motivation
2D physics is essential for platformer-style videos, arcade games, and realistic 2D motion. Matter.js is lightweight, well-maintained, and perfect for 2D game physics.

## Technical Approach

Integrate Matter.js with PixiJS layer, syncing physics bodies with sprite positions and rotations.

### Type Extensions

```typescript
// packages/core/src/types/pixi.ts

export interface PixiLayerProps {
  // ... existing properties
  
  /** 2D physics configuration */
  physics?: {
    enabled: boolean;
    gravity?: { x: number; y: number };
    timestep?: number;
    velocityIterations?: number;
    positionIterations?: number;
  };
}

export interface PixiSprite {
  // ... existing properties
  
  /** Physics rigid body */
  rigidBody?: {
    type: 'dynamic' | 'static' | 'kinematic';
    mass?: number;
    friction?: number;
    frictionAir?: number;
    frictionStatic?: number;
    restitution?: number;
    density?: number;
    velocity?: [number, number];
    angularVelocity?: number;
    collisionFilter?: {
      category?: number;
      mask?: number;
      group?: number;
    };
  };
  
  /** Collider shape */
  collider?: {
    type: 'rectangle' | 'circle' | 'polygon' | 'fromSprite';
    width?: number;
    height?: number;
    radius?: number;
    vertices?: Array<[number, number]>;
    isSensor?: boolean;
  };
  
  /** Collision events */
  collisionEvents?: {
    onCollisionStart?: CollisionAction[];
    onCollisionEnd?: CollisionAction[];
  };
}

export interface PixiConstraint {
  id: string;
  type: 'distance' | 'spring' | 'revolute' | 'prismatic';
  bodyA: string;
  bodyB: string;
  pointA?: [number, number];
  pointB?: [number, number];
  length?: number;
  stiffness?: number;
  damping?: number;
}
```

### Implementation

```typescript
// packages/physics/src/engines/matter2d/MatterPhysicsEngine.ts

import Matter from 'matter-js';

export class MatterPhysicsEngine implements PhysicsEngine2D {
  private engine: Matter.Engine;
  private world: Matter.World;
  private bodies = new Map<string, Matter.Body>();
  private constraints = new Map<string, Matter.Constraint>();
  
  constructor(config: PhysicsWorldConfig2D) {
    this.engine = Matter.Engine.create({
      gravity: {
        x: config.gravity?.x || 0,
        y: config.gravity?.y || 1,
      },
    });
    
    this.world = this.engine.world;
    
    // Setup collision events
    Matter.Events.on(this.engine, 'collisionStart', this.handleCollisionStart.bind(this));
    Matter.Events.on(this.engine, 'collisionEnd', this.handleCollisionEnd.bind(this));
  }
  
  async init(): Promise<void> {
    // Matter.js doesn't require async initialization
  }
  
  step(deltaTime: number): void {
    Matter.Engine.update(this.engine, deltaTime * 1000);
  }
  
  createRigidBody(config: RigidBody2DConfig): RigidBody2D {
    let body: Matter.Body;
    
    // Create body based on collider type
    switch (config.collider.type) {
      case 'rectangle':
        body = Matter.Bodies.rectangle(
          config.position[0],
          config.position[1],
          config.collider.width!,
          config.collider.height!,
          this.getBodyOptions(config)
        );
        break;
        
      case 'circle':
        body = Matter.Bodies.circle(
          config.position[0],
          config.position[1],
          config.collider.radius!,
          this.getBodyOptions(config)
        );
        break;
        
      case 'polygon':
        body = Matter.Bodies.fromVertices(
          config.position[0],
          config.position[1],
          config.collider.vertices!,
          this.getBodyOptions(config)
        );
        break;
    }
    
    // Set body type
    if (config.type === 'static') {
      Matter.Body.setStatic(body, true);
    } else if (config.type === 'kinematic') {
      Matter.Body.setStatic(body, true);
      body.isStatic = false; // Kinematic hack
    }
    
    // Set initial velocity
    if (config.velocity) {
      Matter.Body.setVelocity(body, {
        x: config.velocity[0],
        y: config.velocity[1],
      });
    }
    
    if (config.angularVelocity) {
      Matter.Body.setAngularVelocity(body, config.angularVelocity);
    }
    
    Matter.World.add(this.world, body);
    
    const rigidBody = new MatterRigidBody(body, config.id);
    this.bodies.set(config.id, body);
    
    return rigidBody;
  }
  
  createConstraint(config: ConstraintConfig): Constraint2D {
    const bodyA = this.bodies.get(config.bodyA);
    const bodyB = this.bodies.get(config.bodyB);
    
    if (!bodyA || !bodyB) {
      throw new Error('Bodies not found for constraint');
    }
    
    let constraint: Matter.Constraint;
    
    switch (config.type) {
      case 'distance':
        constraint = Matter.Constraint.create({
          bodyA,
          bodyB,
          pointA: config.pointA ? { x: config.pointA[0], y: config.pointA[1] } : undefined,
          pointB: config.pointB ? { x: config.pointB[0], y: config.pointB[1] } : undefined,
          length: config.length,
          stiffness: config.stiffness || 1,
          damping: config.damping || 0,
        });
        break;
        
      case 'spring':
        constraint = Matter.Constraint.create({
          bodyA,
          bodyB,
          pointA: config.pointA ? { x: config.pointA[0], y: config.pointA[1] } : undefined,
          pointB: config.pointB ? { x: config.pointB[0], y: config.pointB[1] } : undefined,
          stiffness: config.stiffness || 0.5,
          damping: config.damping || 0.1,
        });
        break;
        
      case 'revolute':
        constraint = Matter.Constraint.create({
          bodyA,
          bodyB,
          pointA: config.pointA ? { x: config.pointA[0], y: config.pointA[1] } : { x: 0, y: 0 },
          pointB: config.pointB ? { x: config.pointB[0], y: config.pointB[1] } : { x: 0, y: 0 },
          length: 0,
          stiffness: 1,
        });
        break;
    }
    
    Matter.World.add(this.world, constraint);
    this.constraints.set(config.id, constraint);
    
    return new MatterConstraint(constraint, config.id);
  }
  
  raycast(origin: [number, number], direction: [number, number], maxDistance: number): RaycastHit2D | null {
    const endPoint = [
      origin[0] + direction[0] * maxDistance,
      origin[1] + direction[1] * maxDistance,
    ];
    
    const collisions = Matter.Query.ray(
      this.world.bodies,
      { x: origin[0], y: origin[1] },
      { x: endPoint[0], y: endPoint[1] }
    );
    
    if (collisions.length === 0) return null;
    
    // Return closest collision
    const closest = collisions[0];
    return {
      point: [closest.body.position.x, closest.body.position.y],
      normal: [0, 0], // Matter.js doesn't provide normal easily
      distance: Math.hypot(
        closest.body.position.x - origin[0],
        closest.body.position.y - origin[1]
      ),
      body: new MatterRigidBody(closest.body, ''),
    };
  }
  
  applyForce(bodyId: string, force: [number, number], point?: [number, number]): void {
    const body = this.bodies.get(bodyId);
    if (!body) return;
    
    Matter.Body.applyForce(
      body,
      point ? { x: point[0], y: point[1] } : body.position,
      { x: force[0], y: force[1] }
    );
  }
  
  private getBodyOptions(config: RigidBody2DConfig): Matter.IBodyDefinition {
    return {
      friction: config.friction,
      frictionAir: config.frictionAir,
      frictionStatic: config.frictionStatic,
      restitution: config.restitution,
      density: config.density,
      mass: config.mass,
      collisionFilter: config.collisionFilter,
      isSensor: config.collider.isSensor,
    };
  }
  
  private handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>): void {
    for (const pair of event.pairs) {
      // Emit collision events
      this.emitCollisionEvent('start', pair);
    }
  }
  
  private handleCollisionEnd(event: Matter.IEventCollision<Matter.Engine>): void {
    for (const pair of event.pairs) {
      this.emitCollisionEvent('end', pair);
    }
  }
  
  destroy(): void {
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }
}

class MatterRigidBody implements RigidBody2D {
  constructor(private body: Matter.Body, public id: string) {}
  
  getPosition(): [number, number] {
    return [this.body.position.x, this.body.position.y];
  }
  
  getRotation(): number {
    return this.body.angle;
  }
  
  setPosition(position: [number, number]): void {
    Matter.Body.setPosition(this.body, { x: position[0], y: position[1] });
  }
  
  setRotation(angle: number): void {
    Matter.Body.setAngle(this.body, angle);
  }
  
  setVelocity(velocity: [number, number]): void {
    Matter.Body.setVelocity(this.body, { x: velocity[0], y: velocity[1] });
  }
  
  getVelocity(): [number, number] {
    return [this.body.velocity.x, this.body.velocity.y];
  }
  
  applyForce(force: [number, number], point?: [number, number]): void {
    Matter.Body.applyForce(
      this.body,
      point ? { x: point[0], y: point[1] } : this.body.position,
      { x: force[0], y: force[1] }
    );
  }
  
  applyImpulse(impulse: [number, number], point?: [number, number]): void {
    // Matter.js doesn't have impulse, convert to force
    const force = [impulse[0] / this.body.mass, impulse[1] / this.body.mass];
    this.applyForce(force as [number, number], point);
  }
  
  setEnabled(enabled: boolean): void {
    this.body.isSleeping = !enabled;
  }
  
  destroy(): void {
    // Handled by engine
  }
}
```

### React Integration

```typescript
// packages/renderer-browser/src/layers/pixi/PhysicsSprite.tsx

export function PhysicsSprite({
  sprite,
  physics,
  pixiSprite,
}: PhysicsSpriteProps) {
  const rigidBodyRef = useRef<RigidBody2D | null>(null);
  
  useEffect(() => {
    if (!physics || !sprite.rigidBody) return;
    
    const body = physics.createRigidBody({
      id: sprite.id,
      type: sprite.rigidBody.type,
      position: sprite.position,
      collider: sprite.collider || {
        type: 'rectangle',
        width: pixiSprite.width,
        height: pixiSprite.height,
      },
      ...sprite.rigidBody,
    });
    
    rigidBodyRef.current = body;
    
    return () => {
      body.destroy();
    };
  }, [physics, sprite]);
  
  useFrame(() => {
    if (!rigidBodyRef.current) return;
    
    // Sync PixiJS sprite with physics body
    const position = rigidBodyRef.current.getPosition();
    const rotation = rigidBodyRef.current.getRotation();
    
    pixiSprite.position.set(...position);
    pixiSprite.rotation = rotation;
  });
  
  return null;
}
```

## Implementation Checklist

### Phase 1: Core Integration
- [ ] Add Matter.js to `@rendervid/physics`
- [ ] Implement `MatterPhysicsEngine` class
- [ ] Implement `MatterRigidBody` wrapper
- [ ] Implement collision detection

### Phase 2: Body Types
- [ ] Support rectangle bodies
- [ ] Support circle bodies
- [ ] Support polygon bodies
- [ ] Support compound bodies
- [ ] Auto-generate colliders from sprites

### Phase 3: Constraints
- [ ] Implement distance constraints
- [ ] Implement spring constraints
- [ ] Implement revolute joints
- [ ] Implement prismatic joints

### Phase 4: Advanced Features
- [ ] Collision filtering (layers/groups)
- [ ] Sensors (trigger volumes)
- [ ] Sleeping/waking optimization
- [ ] Continuous collision detection

### Phase 5: React Integration
- [ ] Create `PhysicsWorld2D` component
- [ ] Create `PhysicsSprite` component
- [ ] Sync sprites with physics
- [ ] Handle collision events

### Phase 6: Testing
- [ ] Unit tests for physics engine
- [ ] Test all body types
- [ ] Test constraints
- [ ] Test collision detection
- [ ] Performance tests

### Phase 7: Documentation & Examples
- [ ] 2D physics guide
- [ ] Example: Bouncing balls
- [ ] Example: Platformer physics
- [ ] Example: Angry Birds style
- [ ] Example: Chain/rope simulation
- [ ] Example: Ragdoll physics

## API Design

### Basic Physics

```json
{
  "type": "pixi",
  "props": {
    "physics": {
      "enabled": true,
      "gravity": { "x": 0, "y": 1 }
    },
    "sprites": [
      {
        "id": "ball",
        "texture": "ball.png",
        "position": [400, 100],
        "rigidBody": {
          "type": "dynamic",
          "mass": 1,
          "restitution": 0.8,
          "friction": 0.5
        },
        "collider": {
          "type": "circle",
          "radius": 25
        }
      },
      {
        "id": "ground",
        "texture": "ground.png",
        "position": [400, 550],
        "rigidBody": {
          "type": "static"
        },
        "collider": {
          "type": "rectangle",
          "width": 800,
          "height": 50
        }
      }
    ]
  }
}
```

### Constraints

```json
{
  "sprites": [
    { "id": "anchor", "position": [400, 100], "rigidBody": { "type": "static" } },
    { "id": "ball", "position": [400, 200], "rigidBody": { "type": "dynamic" } }
  ],
  "constraints": [
    {
      "id": "rope",
      "type": "distance",
      "bodyA": "anchor",
      "bodyB": "ball",
      "length": 100,
      "stiffness": 0.9
    }
  ]
}
```

### Collision Events

```json
{
  "sprites": [{
    "id": "projectile",
    "rigidBody": { "type": "dynamic" },
    "collisionEvents": {
      "onCollisionStart": [
        { "type": "spawnParticles", "particleId": "explosion", "count": 50 },
        { "type": "destroy", "delay": 0 }
      ]
    }
  }]
}
```

## Dependencies
- #GAMING-008 (PixiJS layer)

## Acceptance Criteria
- [ ] Physics simulation works correctly
- [ ] All body types supported
- [ ] Constraints work correctly
- [ ] Collision detection accurate
- [ ] Performance good (100+ bodies)
- [ ] Works in browser and Node.js
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-008 (PixiJS layer)
- #GAMING-003 (collision events pattern)

## Notes
- Consider Box2D.js as alternative (more features, heavier)
- Add debug rendering (wireframes)
- Support for one-way platforms
- Consider soft body physics (future)
