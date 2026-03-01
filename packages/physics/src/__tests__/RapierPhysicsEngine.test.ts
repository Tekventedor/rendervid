import { describe, it, expect, beforeEach } from 'vitest';
import { createPhysicsEngine } from '../index';
import type { PhysicsEngine } from '../types';

describe('RapierPhysicsEngine', () => {
  let engine: PhysicsEngine;

  beforeEach(async () => {
    engine = createPhysicsEngine('rapier3d', {
      gravity: [0, -9.81, 0],
    });
    await engine.init();
  });

  it('should create a dynamic rigid body', () => {
    const body = engine.createRigidBody({
      id: 'test-body',
      type: 'dynamic',
      position: [0, 5, 0],
      mass: 1,
    });

    expect(body.id).toBe('test-body');
    expect(body.getPosition()).toEqual([0, 5, 0]);
  });

  it('should create a collider', () => {
    const body = engine.createRigidBody({
      id: 'test-body',
      type: 'dynamic',
      position: [0, 5, 0],
    });

    const collider = engine.createCollider('test-body', {
      type: 'sphere',
      radius: 0.5,
      friction: 0.5,
      restitution: 0.8,
    });

    expect(collider.id).toBe('test-body_collider');
  });

  it('should simulate physics', () => {
    const body = engine.createRigidBody({
      id: 'falling-body',
      type: 'dynamic',
      position: [0, 10, 0],
      mass: 1,
    });

    engine.createCollider('falling-body', {
      type: 'sphere',
      radius: 0.5,
    });

    const initialY = body.getPosition()[1];

    // Simulate for 1 second
    for (let i = 0; i < 60; i++) {
      engine.step(1 / 60);
    }

    const finalY = body.getPosition()[1];
    
    // Body should have fallen due to gravity
    expect(finalY).toBeLessThan(initialY);
  });

  it('should apply impulse', () => {
    const body = engine.createRigidBody({
      id: 'test-body',
      type: 'dynamic',
      position: [0, 0, 0],
      mass: 1,
    });

    body.applyImpulse([0, 10, 0]);
    
    const velocity = body.getLinearVelocity();
    expect(velocity[1]).toBeGreaterThan(0);
  });

  it('should perform raycast', () => {
    engine.createRigidBody({
      id: 'target',
      type: 'static',
      position: [0, 0, 0],
    });

    engine.createCollider('target', {
      type: 'sphere',
      radius: 1,
    });

    const hit = engine.raycast([0, 5, 0], [0, -1, 0], 10);
    
    expect(hit).not.toBeNull();
    expect(hit!.bodyId).toBe('target');
  });
});
