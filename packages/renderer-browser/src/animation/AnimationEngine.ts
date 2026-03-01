// GAMING-006: Minimal Keyframe Animation System (MVP)

export interface Keyframe {
  frame: number;
  value: number | number[];
  easing?: string;
}

export interface Animation {
  property: string;
  keyframes: Keyframe[];
}

export class AnimationEngine {
  evaluate(animation: Animation, frame: number): any {
    const { keyframes } = animation;
    
    // Find surrounding keyframes
    let k1: Keyframe | null = null;
    let k2: Keyframe | null = null;
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
        k1 = keyframes[i];
        k2 = keyframes[i + 1];
        break;
      }
    }
    
    if (!k1) return keyframes[0].value;
    if (!k2) return keyframes[keyframes.length - 1].value;
    
    // Linear interpolation (MVP - full version would support all easing functions)
    const t = (frame - k1.frame) / (k2.frame - k1.frame);
    
    if (typeof k1.value === 'number' && typeof k2.value === 'number') {
      return k1.value + (k2.value - k1.value) * t;
    }
    
    if (Array.isArray(k1.value) && Array.isArray(k2.value)) {
      return k1.value.map((v, i) => v + (k2.value[i] - v) * t);
    }
    
    return k2.value;
  }
}
