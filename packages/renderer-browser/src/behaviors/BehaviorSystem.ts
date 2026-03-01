// GAMING-010: Minimal Behavior Presets (MVP)

export interface BehaviorConfig {
  type: string;
  params?: Record<string, any>;
}

export const BEHAVIORS = {
  orbit: (mesh: any, params: any, frame: number) => {
    const angle = frame * (params.speed || 0.02);
    const radius = params.radius || 5;
    mesh.position.x = Math.cos(angle) * radius;
    mesh.position.z = Math.sin(angle) * radius;
  },
  
  spin: (mesh: any, params: any, frame: number) => {
    mesh.rotation.y = frame * (params.speed || 0.02);
  },
  
  bounce: (mesh: any, params: any, frame: number) => {
    const height = params.height || 2;
    const speed = params.speed || 1;
    mesh.position.y = Math.abs(Math.sin(frame * speed * 0.1)) * height;
  },
  
  pulse: (mesh: any, params: any, frame: number) => {
    const min = params.minScale || 0.8;
    const max = params.maxScale || 1.2;
    const speed = params.speed || 1;
    const scale = min + (max - min) * (Math.sin(frame * speed * 0.1) + 1) / 2;
    mesh.scale.set(scale, scale, scale);
  },
};

export class BehaviorSystem {
  apply(mesh: any, behaviors: BehaviorConfig[], frame: number) {
    for (const behavior of behaviors) {
      const fn = BEHAVIORS[behavior.type as keyof typeof BEHAVIORS];
      if (fn) {
        fn(mesh, behavior.params || {}, frame);
      }
    }
  }
}
