// Minimal physics integration - MVP version
// Full implementation would include proper React hooks and synchronization

import { createPhysicsEngine } from '@rendervid/physics';
import type { PhysicsEngine } from '@rendervid/physics';
import type { ThreeLayerProps, ThreeMeshConfig } from '@rendervid/core';

export class PhysicsManager {
  private engine: PhysicsEngine | null = null;
  private meshBodies = new Map<string, any>();

  async init(config: ThreeLayerProps['physics']) {
    if (!config?.enabled) return;

    this.engine = createPhysicsEngine('rapier3d', {
      gravity: config.gravity || [0, -9.81, 0],
      timestep: config.timestep || 1 / 60,
    });

    await this.engine.init();
  }

  addMesh(mesh: ThreeMeshConfig, threeObject: any) {
    if (!this.engine || !mesh.rigidBody) return;

    const body = this.engine.createRigidBody({
      id: mesh.id,
      type: mesh.rigidBody.type,
      position: mesh.position || [0, 0, 0],
      mass: mesh.rigidBody.mass,
      linearVelocity: mesh.rigidBody.linearVelocity,
      angularVelocity: mesh.rigidBody.angularVelocity,
    });

    if (mesh.collider) {
      this.engine.createCollider(mesh.id, {
        type: mesh.collider.type,
        halfExtents: mesh.collider.halfExtents,
        radius: mesh.collider.radius,
        halfHeight: mesh.collider.halfHeight,
        friction: mesh.rigidBody.friction,
        restitution: mesh.rigidBody.restitution,
      });
    }

    this.meshBodies.set(mesh.id, { body, threeObject });
  }

  step(deltaTime: number) {
    if (!this.engine) return;

    this.engine.step(deltaTime);

    // Sync Three.js objects with physics bodies
    for (const [id, { body, threeObject }] of this.meshBodies) {
      const position = body.getPosition();
      const rotation = body.getRotation();

      threeObject.position.set(position[0], position[1], position[2]);
      threeObject.quaternion.set(rotation[0], rotation[1], rotation[2], rotation[3]);
    }
  }

  destroy() {
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
    this.meshBodies.clear();
  }
}
