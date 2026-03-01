import RAPIER from '@dimforge/rapier3d-compat';
import type {
  PhysicsEngine,
  RigidBodyConfig,
  ColliderConfig,
  RigidBody,
  Collider,
  RaycastHit,
  PhysicsWorldConfig,
  Vector3,
  Quaternion,
  CollisionCallback,
} from '../../types.js';

export class RapierPhysicsEngine implements PhysicsEngine {
  private world: RAPIER.World | null = null;
  private bodies = new Map<string, RAPIER.RigidBody>();
  private bodyWrappers = new Map<string, RapierRigidBody>();
  private collisionCallbacks = new Map<string, CollisionCallback[]>();

  constructor(private config: PhysicsWorldConfig) {}

  async init(): Promise<void> {
    await RAPIER.init();
    const gravity = new RAPIER.Vector3(
      this.config.gravity[0],
      this.config.gravity[1],
      this.config.gravity[2]
    );
    this.world = new RAPIER.World(gravity);
  }

  step(deltaTime: number): void {
    if (!this.world) return;
    this.world.step();
  }

  createRigidBody(config: RigidBodyConfig): RigidBody {
    if (!this.world) throw new Error('Physics world not initialized');

    let desc: RAPIER.RigidBodyDesc;
    
    if (config.type === 'dynamic') {
      desc = RAPIER.RigidBodyDesc.dynamic();
    } else if (config.type === 'static') {
      desc = RAPIER.RigidBodyDesc.fixed();
    } else {
      desc = RAPIER.RigidBodyDesc.kinematicPositionBased();
    }

    if (config.position) {
      desc.setTranslation(config.position[0], config.position[1], config.position[2]);
    }

    const rapierBody = this.world.createRigidBody(desc);
    this.bodies.set(config.id, rapierBody);
    
    const wrapper = new RapierRigidBody(config.id, rapierBody);
    this.bodyWrappers.set(config.id, wrapper);
    
    return wrapper;
  }

  createCollider(bodyId: string, config: ColliderConfig): Collider {
    if (!this.world) throw new Error('Physics world not initialized');
    
    const body = this.bodies.get(bodyId);
    if (!body) throw new Error(`Body ${bodyId} not found`);

    let desc: RAPIER.ColliderDesc;

    if (config.type === 'cuboid' && config.halfExtents) {
      desc = RAPIER.ColliderDesc.cuboid(
        config.halfExtents[0],
        config.halfExtents[1],
        config.halfExtents[2]
      );
    } else if (config.type === 'sphere' && config.radius) {
      desc = RAPIER.ColliderDesc.ball(config.radius);
    } else if (config.type === 'capsule' && config.halfHeight && config.radius) {
      desc = RAPIER.ColliderDesc.capsule(config.halfHeight, config.radius);
    } else {
      throw new Error(`Unsupported collider type: ${config.type}`);
    }

    if (config.friction !== undefined) {
      desc.setFriction(config.friction);
    }

    if (config.restitution !== undefined) {
      desc.setRestitution(config.restitution);
    }

    const rapierCollider = this.world.createCollider(desc, body);
    const colliderId = `${bodyId}_collider`;
    
    return new RapierCollider(colliderId, rapierCollider);
  }

  raycast(origin: Vector3, direction: Vector3, maxDistance: number): RaycastHit | null {
    if (!this.world) return null;

    const ray = new RAPIER.Ray(
      { x: origin[0], y: origin[1], z: origin[2] },
      { x: direction[0], y: direction[1], z: direction[2] }
    );

    const hit = this.world.castRay(ray, maxDistance, true);
    if (!hit) return null;

    const hitPoint = ray.pointAt(hit.toi);

    return {
      point: [hitPoint.x, hitPoint.y, hitPoint.z],
      normal: [0, 1, 0],
      distance: hit.toi,
      bodyId: 'unknown',
    };
  }

  addCollisionCallback(bodyId: string, callback: CollisionCallback): void {
    if (!this.collisionCallbacks.has(bodyId)) {
      this.collisionCallbacks.set(bodyId, []);
    }
    this.collisionCallbacks.get(bodyId)!.push(callback);
  }

  destroy(): void {
    if (this.world) {
      this.world.free();
      this.world = null;
    }
    this.bodies.clear();
    this.bodyWrappers.clear();
    this.collisionCallbacks.clear();
  }
}

class RapierRigidBody implements RigidBody {
  constructor(
    public id: string,
    private body: RAPIER.RigidBody
  ) {}

  setPosition(position: Vector3): void {
    this.body.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
  }

  setRotation(rotation: Quaternion): void {
    this.body.setRotation({ x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] }, true);
  }

  setLinearVelocity(velocity: Vector3): void {
    this.body.setLinvel({ x: velocity[0], y: velocity[1], z: velocity[2] }, true);
  }

  setAngularVelocity(velocity: Vector3): void {
    this.body.setAngvel({ x: velocity[0], y: velocity[1], z: velocity[2] }, true);
  }

  applyImpulse(impulse: Vector3, point?: Vector3): void {
    if (point) {
      this.body.applyImpulseAtPoint(
        { x: impulse[0], y: impulse[1], z: impulse[2] },
        { x: point[0], y: point[1], z: point[2] },
        true
      );
    } else {
      this.body.applyImpulse({ x: impulse[0], y: impulse[1], z: impulse[2] }, true);
    }
  }

  applyForce(force: Vector3, point?: Vector3): void {
    if (point) {
      this.body.addForceAtPoint(
        { x: force[0], y: force[1], z: force[2] },
        { x: point[0], y: point[1], z: point[2] },
        true
      );
    } else {
      this.body.addForce({ x: force[0], y: force[1], z: force[2] }, true);
    }
  }

  applyTorque(torque: Vector3): void {
    this.body.addTorque({ x: torque[0], y: torque[1], z: torque[2] }, true);
  }

  getPosition(): Vector3 {
    const pos = this.body.translation();
    return [pos.x, pos.y, pos.z];
  }

  getRotation(): Quaternion {
    const rot = this.body.rotation();
    return [rot.x, rot.y, rot.z, rot.w];
  }

  getLinearVelocity(): Vector3 {
    const vel = this.body.linvel();
    return [vel.x, vel.y, vel.z];
  }

  getAngularVelocity(): Vector3 {
    const vel = this.body.angvel();
    return [vel.x, vel.y, vel.z];
  }

  setEnabled(enabled: boolean): void {
    this.body.setEnabled(enabled);
  }

  destroy(): void {
    // Handled by world
  }
}

class RapierCollider implements Collider {
  constructor(
    public id: string,
    private collider: RAPIER.Collider
  ) {}

  setFriction(friction: number): void {
    this.collider.setFriction(friction);
  }

  setRestitution(restitution: number): void {
    this.collider.setRestitution(restitution);
  }

  setEnabled(enabled: boolean): void {
    this.collider.setEnabled(enabled);
  }

  destroy(): void {
    // Handled by world
  }
}
