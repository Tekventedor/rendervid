// GAMING-010: Full Behavior Preset Library with 15+ Behaviors

export type BehaviorType =
  | 'orbit' | 'spin' | 'bounce' | 'pulse' | 'float' | 'wobble'
  | 'spiral' | 'figure8' | 'pendulum' | 'wave' | 'shake' | 'breathe'
  | 'follow' | 'lookAt' | 'patrol' | 'hover';

export interface BehaviorConfig {
  type: BehaviorType;
  params: Record<string, any>;
}

interface BehaviorState {
  time: number;
  [key: string]: any;
}

export class BehaviorSystem {
  private behaviors: Map<string, { config: BehaviorConfig; state: BehaviorState }> = new Map();

  addBehavior(id: string, config: BehaviorConfig): void {
    this.behaviors.set(id, { config, state: { time: 0 } });
  }

  removeBehavior(id: string): void {
    this.behaviors.delete(id);
  }

  update(deltaTime: number, target: any): void {
    for (const [id, { config, state }] of this.behaviors) {
      state.time += deltaTime;
      this.applyBehavior(config, state, target);
    }
  }

  private applyBehavior(config: BehaviorConfig, state: BehaviorState, target: any): void {
    const { type, params } = config;
    const t = state.time;

    switch (type) {
      case 'orbit': {
        const radius = params.radius || 5;
        const speed = params.speed || 1;
        const axis = params.axis || 'y';
        const angle = t * speed;
        
        if (axis === 'y') {
          target.position.x = Math.cos(angle) * radius;
          target.position.z = Math.sin(angle) * radius;
        } else if (axis === 'x') {
          target.position.y = Math.cos(angle) * radius;
          target.position.z = Math.sin(angle) * radius;
        } else {
          target.position.x = Math.cos(angle) * radius;
          target.position.y = Math.sin(angle) * radius;
        }
        break;
      }

      case 'spin': {
        const speed = params.speed || 1;
        const axis = params.axis || 'y';
        
        if (axis === 'x') target.rotation.x = t * speed;
        else if (axis === 'y') target.rotation.y = t * speed;
        else target.rotation.z = t * speed;
        break;
      }

      case 'bounce': {
        const height = params.height || 2;
        const speed = params.speed || 2;
        const offset = params.offset || 0;
        
        target.position.y = offset + Math.abs(Math.sin(t * speed)) * height;
        break;
      }

      case 'pulse': {
        const min = params.min || 0.8;
        const max = params.max || 1.2;
        const speed = params.speed || 2;
        
        const scale = min + (max - min) * (Math.sin(t * speed) * 0.5 + 0.5);
        target.scale.set(scale, scale, scale);
        break;
      }

      case 'float': {
        const amplitude = params.amplitude || 0.5;
        const speed = params.speed || 1;
        const offset = params.offset || 0;
        
        target.position.y = offset + Math.sin(t * speed) * amplitude;
        break;
      }

      case 'wobble': {
        const amount = params.amount || 0.2;
        const speed = params.speed || 3;
        
        target.rotation.x = Math.sin(t * speed) * amount;
        target.rotation.z = Math.cos(t * speed * 1.3) * amount;
        break;
      }

      case 'spiral': {
        const radius = params.radius || 5;
        const height = params.height || 10;
        const speed = params.speed || 1;
        const angle = t * speed;
        
        target.position.x = Math.cos(angle) * radius;
        target.position.y = (t * speed) % height;
        target.position.z = Math.sin(angle) * radius;
        break;
      }

      case 'figure8': {
        const size = params.size || 3;
        const speed = params.speed || 1;
        const angle = t * speed;
        
        target.position.x = Math.sin(angle) * size;
        target.position.y = Math.sin(angle * 2) * size;
        break;
      }

      case 'pendulum': {
        const length = params.length || 3;
        const speed = params.speed || 1;
        const maxAngle = params.maxAngle || Math.PI / 4;
        
        const angle = Math.sin(t * speed) * maxAngle;
        target.position.x = Math.sin(angle) * length;
        target.position.y = -Math.cos(angle) * length;
        break;
      }

      case 'wave': {
        const amplitude = params.amplitude || 1;
        const frequency = params.frequency || 2;
        const speed = params.speed || 1;
        const axis = params.axis || 'y';
        
        const value = Math.sin(t * speed * frequency) * amplitude;
        if (axis === 'x') target.position.x += value;
        else if (axis === 'y') target.position.y += value;
        else target.position.z += value;
        break;
      }

      case 'shake': {
        const intensity = params.intensity || 0.1;
        const speed = params.speed || 10;
        
        target.position.x += (Math.random() - 0.5) * intensity * Math.sin(t * speed);
        target.position.y += (Math.random() - 0.5) * intensity * Math.sin(t * speed * 1.1);
        target.position.z += (Math.random() - 0.5) * intensity * Math.sin(t * speed * 0.9);
        break;
      }

      case 'breathe': {
        const min = params.min || 0.9;
        const max = params.max || 1.1;
        const speed = params.speed || 0.5;
        
        const scale = min + (max - min) * (Math.sin(t * speed) * 0.5 + 0.5);
        target.scale.set(scale, scale, scale);
        break;
      }

      case 'follow': {
        const targetPos = params.target || [0, 0, 0];
        const speed = params.speed || 2;
        const smoothing = params.smoothing || 0.1;
        
        target.position.x += (targetPos[0] - target.position.x) * smoothing * speed * 0.016;
        target.position.y += (targetPos[1] - target.position.y) * smoothing * speed * 0.016;
        target.position.z += (targetPos[2] - target.position.z) * smoothing * speed * 0.016;
        break;
      }

      case 'lookAt': {
        const targetPos = params.target || [0, 0, 0];
        const smoothing = params.smoothing || 0.1;
        
        if (target.lookAt) {
          const dx = targetPos[0] - target.position.x;
          const dy = targetPos[1] - target.position.y;
          const dz = targetPos[2] - target.position.z;
          
          const targetRotY = Math.atan2(dx, dz);
          const targetRotX = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
          
          target.rotation.y += (targetRotY - target.rotation.y) * smoothing;
          target.rotation.x += (targetRotX - target.rotation.x) * smoothing;
        }
        break;
      }

      case 'patrol': {
        const points = params.points || [[0, 0, 0], [5, 0, 0], [5, 0, 5], [0, 0, 5]];
        const speed = params.speed || 1;
        const smoothing = params.smoothing || 0.05;
        
        if (!state.currentPoint) state.currentPoint = 0;
        
        const targetPoint = points[state.currentPoint];
        const dx = targetPoint[0] - target.position.x;
        const dy = targetPoint[1] - target.position.y;
        const dz = targetPoint[2] - target.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 0.5) {
          state.currentPoint = (state.currentPoint + 1) % points.length;
        } else {
          target.position.x += dx * smoothing * speed;
          target.position.y += dy * smoothing * speed;
          target.position.z += dz * smoothing * speed;
        }
        break;
      }

      case 'hover': {
        const height = params.height || 2;
        const wobbleAmount = params.wobbleAmount || 0.3;
        const speed = params.speed || 1;
        
        target.position.y = height + Math.sin(t * speed) * wobbleAmount;
        target.rotation.x = Math.sin(t * speed * 0.7) * 0.1;
        target.rotation.z = Math.cos(t * speed * 0.5) * 0.1;
        break;
      }
    }
  }
}
