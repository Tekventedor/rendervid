// GAMING-003: Collision Events System

export interface CollisionEvent {
  type: 'collisionStart' | 'collisionEnd' | 'collisionStay';
  bodyA: string;
  bodyB: string;
  point: [number, number, number];
  normal: [number, number, number];
  impulse: number;
  timestamp: number;
}

export interface CollisionAction {
  type: 'playSound' | 'spawnParticles' | 'changeColor' | 'applyForce' | 'destroy' | 'custom';
  params: Record<string, any>;
}

export interface CollisionRule {
  bodyA?: string;
  bodyB?: string;
  tag?: string;
  minImpulse?: number;
  maxImpulse?: number;
  actions: CollisionAction[];
}

export class CollisionEventSystem {
  private rules: CollisionRule[] = [];
  private listeners: Map<string, Array<(event: CollisionEvent) => void>> = new Map();
  private activeCollisions: Set<string> = new Set();

  addRule(rule: CollisionRule): void {
    this.rules.push(rule);
  }

  removeRule(rule: CollisionRule): void {
    const index = this.rules.indexOf(rule);
    if (index > -1) {
      this.rules.splice(index, 1);
    }
  }

  on(eventType: CollisionEvent['type'], callback: (event: CollisionEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  off(eventType: CollisionEvent['type'], callback: (event: CollisionEvent) => void): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  handleCollision(event: CollisionEvent): void {
    const collisionKey = this.getCollisionKey(event.bodyA, event.bodyB);
    
    if (event.type === 'collisionStart') {
      if (!this.activeCollisions.has(collisionKey)) {
        this.activeCollisions.add(collisionKey);
        this.processEvent(event);
      }
    } else if (event.type === 'collisionEnd') {
      this.activeCollisions.delete(collisionKey);
      this.processEvent(event);
    } else if (event.type === 'collisionStay') {
      if (this.activeCollisions.has(collisionKey)) {
        this.processEvent(event);
      }
    }
  }

  private processEvent(event: CollisionEvent): void {
    // Emit to listeners
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      callbacks.forEach(cb => cb(event));
    }

    // Process rules
    for (const rule of this.rules) {
      if (this.matchesRule(event, rule)) {
        this.executeActions(event, rule.actions);
      }
    }
  }

  private matchesRule(event: CollisionEvent, rule: CollisionRule): boolean {
    if (rule.bodyA && event.bodyA !== rule.bodyA && event.bodyB !== rule.bodyA) {
      return false;
    }
    if (rule.bodyB && event.bodyA !== rule.bodyB && event.bodyB !== rule.bodyB) {
      return false;
    }
    if (rule.minImpulse !== undefined && event.impulse < rule.minImpulse) {
      return false;
    }
    if (rule.maxImpulse !== undefined && event.impulse > rule.maxImpulse) {
      return false;
    }
    return true;
  }

  private executeActions(event: CollisionEvent, actions: CollisionAction[]): void {
    for (const action of actions) {
      switch (action.type) {
        case 'playSound':
          this.playSound(action.params);
          break;
        case 'spawnParticles':
          this.spawnParticles(event, action.params);
          break;
        case 'changeColor':
          this.changeColor(event, action.params);
          break;
        case 'applyForce':
          this.applyForce(event, action.params);
          break;
        case 'destroy':
          this.destroy(event, action.params);
          break;
        case 'custom':
          if (action.params.callback) {
            action.params.callback(event);
          }
          break;
      }
    }
  }

  private playSound(params: Record<string, any>): void {
    // Sound playback implementation
    console.log('Play sound:', params.sound);
  }

  private spawnParticles(event: CollisionEvent, params: Record<string, any>): void {
    // Particle spawning implementation
    console.log('Spawn particles at:', event.point, params);
  }

  private changeColor(event: CollisionEvent, params: Record<string, any>): void {
    // Color change implementation
    console.log('Change color:', params.color);
  }

  private applyForce(event: CollisionEvent, params: Record<string, any>): void {
    // Force application implementation
    console.log('Apply force:', params.force);
  }

  private destroy(event: CollisionEvent, params: Record<string, any>): void {
    // Destruction implementation
    console.log('Destroy:', params.target || event.bodyA);
  }

  private getCollisionKey(bodyA: string, bodyB: string): string {
    return bodyA < bodyB ? `${bodyA}-${bodyB}` : `${bodyB}-${bodyA}`;
  }

  clear(): void {
    this.rules = [];
    this.listeners.clear();
    this.activeCollisions.clear();
  }
}
