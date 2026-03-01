import { RapierPhysicsEngine } from './engines/rapier3d/RapierPhysicsEngine';
import type { PhysicsEngine, PhysicsWorldConfig } from './types';

export * from './types';
export { RapierPhysicsEngine };

export function createPhysicsEngine(
  type: 'rapier3d',
  config: PhysicsWorldConfig
): PhysicsEngine {
  switch (type) {
    case 'rapier3d':
      return new RapierPhysicsEngine(config);
    default:
      throw new Error(`Unknown physics engine type: ${type}`);
  }
}
