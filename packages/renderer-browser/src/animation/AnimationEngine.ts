// GAMING-006: Full Keyframe Animation System with 30+ Easing Functions

export interface KeyframeConfig {
  frame: number;
  value: number | [number, number, number];
  easing?: EasingFunction;
}

export interface AnimationConfig {
  property: string;
  keyframes: KeyframeConfig[];
  loop?: boolean;
  pingPong?: boolean;
}

export type EasingFunction = 
  | 'linear'
  | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
  | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
  | 'easeInSine' | 'easeOutSine' | 'easeInOutSine'
  | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
  | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
  | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'
  | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic'
  | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  
  easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  
  easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t) => Math.sqrt(1 - (--t) * t),
  easeInOutCirc: (t) => t < 0.5 ? (1 - Math.sqrt(1 - 4 * t * t)) / 2 : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,
  
  easeInBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  
  easeInElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (t) => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
  },
  
  easeInBounce: (t) => 1 - easingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t) => t < 0.5
    ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
    : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2,
};

export class AnimationEngine {
  private animations: Map<string, AnimationConfig> = new Map();

  addAnimation(id: string, config: AnimationConfig): void {
    this.animations.set(id, config);
  }

  removeAnimation(id: string): void {
    this.animations.delete(id);
  }

  evaluate(id: string, frame: number): number | [number, number, number] | null {
    const anim = this.animations.get(id);
    if (!anim || anim.keyframes.length === 0) return null;

    const keyframes = [...anim.keyframes].sort((a, b) => a.frame - b.frame);
    
    let totalFrames = keyframes[keyframes.length - 1].frame;
    let currentFrame = frame;

    if (anim.loop || anim.pingPong) {
      if (anim.pingPong) {
        const cycle = totalFrames * 2;
        currentFrame = frame % cycle;
        if (currentFrame > totalFrames) {
          currentFrame = cycle - currentFrame;
        }
      } else {
        currentFrame = frame % totalFrames;
      }
    }

    if (currentFrame <= keyframes[0].frame) {
      return keyframes[0].value;
    }
    if (currentFrame >= keyframes[keyframes.length - 1].frame) {
      return keyframes[keyframes.length - 1].value;
    }

    let startKf = keyframes[0];
    let endKf = keyframes[1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (currentFrame >= keyframes[i].frame && currentFrame <= keyframes[i + 1].frame) {
        startKf = keyframes[i];
        endKf = keyframes[i + 1];
        break;
      }
    }

    const duration = endKf.frame - startKf.frame;
    const elapsed = currentFrame - startKf.frame;
    const t = duration > 0 ? elapsed / duration : 0;

    const easing = endKf.easing || 'linear';
    const easedT = easingFunctions[easing](t);

    if (typeof startKf.value === 'number' && typeof endKf.value === 'number') {
      return startKf.value + (endKf.value - startKf.value) * easedT;
    }

    if (Array.isArray(startKf.value) && Array.isArray(endKf.value)) {
      return [
        startKf.value[0] + (endKf.value[0] - startKf.value[0]) * easedT,
        startKf.value[1] + (endKf.value[1] - startKf.value[1]) * easedT,
        startKf.value[2] + (endKf.value[2] - startKf.value[2]) * easedT,
      ];
    }

    return startKf.value;
  }

  update(frame: number, target: any): void {
    for (const [id, anim] of this.animations) {
      const value = this.evaluate(id, frame);
      if (value !== null) {
        this.setProperty(target, anim.property, value);
      }
    }
  }

  private setProperty(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) return;
      current = current[parts[i]];
    }
    
    const lastPart = parts[parts.length - 1];
    if (lastPart in current) {
      if (Array.isArray(value) && Array.isArray(current[lastPart])) {
        current[lastPart][0] = value[0];
        current[lastPart][1] = value[1];
        current[lastPart][2] = value[2];
      } else {
        current[lastPart] = value;
      }
    }
  }
}
