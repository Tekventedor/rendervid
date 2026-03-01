// Core types for physics engine
export type Vector3 = [number, number, number];
export type Quaternion = [number, number, number, number];

export interface PhysicsEngine {
  init(): Promise<void>;
  step(deltaTime: number): void;
  createRigidBody(config: RigidBodyConfig): RigidBody;
  createCollider(bodyId: string, config: ColliderConfig): Collider;
  raycast(origin: Vector3, direction: Vector3, maxDistance: number): RaycastHit | null;
  destroy(): void;
}

export interface RigidBodyConfig {
  id: string;
  type: 'dynamic' | 'static' | 'kinematic';
  position?: Vector3;
  rotation?: Quaternion;
  mass?: number;
  linearVelocity?: Vector3;
  angularVelocity?: Vector3;
  linearDamping?: number;
  angularDamping?: number;
  gravityScale?: number;
  canSleep?: boolean;
  ccd?: boolean;
}

export interface ColliderConfig {
  type: 'cuboid' | 'sphere' | 'capsule' | 'cylinder' | 'cone' | 'trimesh';
  halfExtents?: Vector3;
  radius?: number;
  halfHeight?: number;
  vertices?: number[];
  indices?: number[];
  friction?: number;
  restitution?: number;
  density?: number;
  isSensor?: boolean;
}

export interface RigidBody {
  id: string;
  setPosition(position: Vector3): void;
  setRotation(rotation: Quaternion): void;
  setLinearVelocity(velocity: Vector3): void;
  setAngularVelocity(velocity: Vector3): void;
  applyImpulse(impulse: Vector3, point?: Vector3): void;
  applyForce(force: Vector3, point?: Vector3): void;
  applyTorque(torque: Vector3): void;
  getPosition(): Vector3;
  getRotation(): Quaternion;
  getLinearVelocity(): Vector3;
  getAngularVelocity(): Vector3;
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
  point: Vector3;
  normal: Vector3;
  distance: number;
  bodyId: string;
}

export interface PhysicsWorldConfig {
  gravity: Vector3;
  timestep?: number;
  maxSubsteps?: number;
}

export interface CollisionEvent {
  type: 'start' | 'end';
  bodyA: string;
  bodyB: string;
  impulse: number;
  point: Vector3;
  normal: Vector3;
}

export type CollisionCallback = (event: CollisionEvent) => void;
