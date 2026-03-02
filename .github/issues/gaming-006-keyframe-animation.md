# [GAMING-006] Advanced Animation System with Keyframes

## Overview
Create a comprehensive keyframe animation system that goes beyond simple auto-rotation, supporting position, rotation, scale, material properties, and custom properties with bezier curves and easing functions.

## Motivation
Game-style videos need complex, choreographed animations. Current auto-rotation is too limited. Need timeline-based keyframe system for cinematic camera movements, object animations, and property changes.

## Technical Approach

Extend existing animation system with keyframe support, inspired by animation tools like After Effects and Blender.

### Type Definitions

```typescript
// packages/core/src/types/three.ts

export interface KeyframeAnimation {
  /** Property path to animate (e.g., "position.y", "material.color", "rotation.x") */
  property: string;
  
  /** Keyframes defining the animation */
  keyframes: Keyframe[];
  
  /** Loop behavior */
  loop?: 'none' | 'repeat' | 'pingpong';
  
  /** Number of loops (0 = infinite) */
  loopCount?: number;
}

export interface Keyframe {
  /** Frame number */
  frame: number;
  
  /** Value at this keyframe */
  value: number | string | [number, number, number] | [number, number, number, number];
  
  /** Easing function */
  easing?: EasingFunction;
  
  /** Bezier curve control points (for custom easing) */
  bezier?: {
    cp1: [number, number];
    cp2: [number, number];
  };
}

export type EasingFunction = 
  | 'linear'
  | 'easeIn' | 'easeOut' | 'easeInOut'
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

export interface ThreeMeshConfig {
  // ... existing properties
  
  /** Keyframe animations */
  animations?: KeyframeAnimation[];
  
  /** Remove autoRotate (replaced by keyframe animations) */
  // autoRotate?: [number, number, number]; // DEPRECATED
}

export interface ThreeCameraConfig {
  // ... existing properties
  
  /** Camera animations */
  animations?: KeyframeAnimation[];
}

export interface ThreeLightConfig {
  // ... existing properties
  
  /** Light animations */
  animations?: KeyframeAnimation[];
}
```

### Animation Engine

```typescript
// packages/renderer-browser/src/layers/three/animation/AnimationEngine.ts

export class AnimationEngine {
  private animations = new Map<string, AnimationTrack>();
  
  addAnimation(targetId: string, animation: KeyframeAnimation) {
    const track = new AnimationTrack(animation);
    this.animations.set(`${targetId}.${animation.property}`, track);
  }
  
  update(frame: number, targets: Map<string, any>) {
    for (const [key, track] of this.animations) {
      const [targetId, property] = key.split('.');
      const target = targets.get(targetId);
      
      if (target) {
        const value = track.evaluate(frame);
        this.setProperty(target, property, value);
      }
    }
  }
  
  private setProperty(target: any, path: string, value: any) {
    const parts = path.split('.');
    let obj = target;
    
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }
    
    const finalProp = parts[parts.length - 1];
    
    if (Array.isArray(value)) {
      // Vector or quaternion
      if (obj[finalProp].set) {
        obj[finalProp].set(...value);
      } else if (obj[finalProp].fromArray) {
        obj[finalProp].fromArray(value);
      }
    } else if (typeof value === 'string' && finalProp === 'color') {
      // Color
      obj[finalProp].set(value);
    } else {
      // Scalar
      obj[finalProp] = value;
    }
  }
}

class AnimationTrack {
  private keyframes: Keyframe[];
  private loop: 'none' | 'repeat' | 'pingpong';
  private loopCount: number;
  
  constructor(animation: KeyframeAnimation) {
    this.keyframes = animation.keyframes.sort((a, b) => a.frame - b.frame);
    this.loop = animation.loop || 'none';
    this.loopCount = animation.loopCount || 0;
  }
  
  evaluate(frame: number): any {
    // Handle looping
    const duration = this.keyframes[this.keyframes.length - 1].frame;
    let localFrame = frame;
    
    if (this.loop === 'repeat') {
      localFrame = frame % duration;
    } else if (this.loop === 'pingpong') {
      const cycle = Math.floor(frame / duration);
      localFrame = cycle % 2 === 0 
        ? frame % duration 
        : duration - (frame % duration);
    }
    
    // Find surrounding keyframes
    let k1: Keyframe | null = null;
    let k2: Keyframe | null = null;
    
    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (localFrame >= this.keyframes[i].frame && localFrame <= this.keyframes[i + 1].frame) {
        k1 = this.keyframes[i];
        k2 = this.keyframes[i + 1];
        break;
      }
    }
    
    // Before first keyframe
    if (!k1) return this.keyframes[0].value;
    
    // After last keyframe
    if (!k2) return this.keyframes[this.keyframes.length - 1].value;
    
    // Interpolate
    const t = (localFrame - k1.frame) / (k2.frame - k1.frame);
    const easedT = this.applyEasing(t, k1.easing || 'linear', k1.bezier);
    
    return this.interpolate(k1.value, k2.value, easedT);
  }
  
  private applyEasing(t: number, easing: EasingFunction, bezier?: any): number {
    if (bezier) {
      return this.cubicBezier(t, bezier.cp1, bezier.cp2);
    }
    
    switch (easing) {
      case 'linear': return t;
      case 'easeInQuad': return t * t;
      case 'easeOutQuad': return t * (2 - t);
      case 'easeInOutQuad': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeInCubic': return t * t * t;
      case 'easeOutCubic': return (--t) * t * t + 1;
      case 'easeInOutCubic': return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      case 'easeInElastic': return this.elasticIn(t);
      case 'easeOutElastic': return this.elasticOut(t);
      case 'easeInBounce': return 1 - this.bounceOut(1 - t);
      case 'easeOutBounce': return this.bounceOut(t);
      // ... more easing functions
      default: return t;
    }
  }
  
  private cubicBezier(t: number, cp1: [number, number], cp2: [number, number]): number {
    // Cubic bezier curve implementation
    const cx = 3 * cp1[0];
    const bx = 3 * (cp2[0] - cp1[0]) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * cp1[1];
    const by = 3 * (cp2[1] - cp1[1]) - cy;
    const ay = 1 - cy - by;
    
    return ((ax * t + bx) * t + cx) * t;
  }
  
  private interpolate(v1: any, v2: any, t: number): any {
    if (typeof v1 === 'number' && typeof v2 === 'number') {
      return v1 + (v2 - v1) * t;
    }
    
    if (Array.isArray(v1) && Array.isArray(v2)) {
      return v1.map((val, i) => val + (v2[i] - val) * t);
    }
    
    if (typeof v1 === 'string' && typeof v2 === 'string') {
      // Color interpolation
      return this.interpolateColor(v1, v2, t);
    }
    
    return v2; // Discrete values
  }
  
  private interpolateColor(c1: string, c2: string, t: number): string {
    const color1 = new Color(c1);
    const color2 = new Color(c2);
    return '#' + color1.lerp(color2, t).getHexString();
  }
  
  private elasticOut(t: number): number {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }
  
  private bounceOut(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
}
```

### React Integration

```typescript
// packages/renderer-browser/src/layers/three/AnimatedMesh.tsx

export function AnimatedMesh({ 
  mesh, 
  animations, 
  frame 
}: AnimatedMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const animationEngine = useRef(new AnimationEngine());
  
  useEffect(() => {
    if (!animations) return;
    
    animations.forEach(anim => {
      animationEngine.current.addAnimation(mesh.id, anim);
    });
  }, [animations]);
  
  useFrame(() => {
    if (meshRef.current) {
      const targets = new Map([[mesh.id, meshRef.current]]);
      animationEngine.current.update(frame, targets);
    }
  });
  
  return <mesh ref={meshRef}>{/* ... */}</mesh>;
}
```

## Implementation Checklist

### Phase 1: Core Animation Engine
- [ ] Create `AnimationEngine` class
- [ ] Implement `AnimationTrack` class
- [ ] Implement keyframe evaluation
- [ ] Implement interpolation (number, vector, color)
- [ ] Add loop support (repeat, pingpong)

### Phase 2: Easing Functions
- [ ] Implement all standard easing functions (30+)
- [ ] Implement cubic bezier curves
- [ ] Add easing visualization tool (for docs)

### Phase 3: Property Animation
- [ ] Support position animation
- [ ] Support rotation animation (euler and quaternion)
- [ ] Support scale animation
- [ ] Support material property animation
- [ ] Support camera animation
- [ ] Support light animation

### Phase 4: React Integration
- [ ] Create `AnimatedMesh` component
- [ ] Create `AnimatedCamera` component
- [ ] Create `AnimatedLight` component
- [ ] Integrate with existing `ThreeLayer`

### Phase 5: Advanced Features
- [ ] Animation blending (crossfade between animations)
- [ ] Animation events (callbacks at specific frames)
- [ ] Path animation (follow spline curve)
- [ ] Look-at constraints
- [ ] Parent-child animation inheritance

### Phase 6: Testing
- [ ] Unit tests for interpolation
- [ ] Unit tests for easing functions
- [ ] Integration tests for all property types
- [ ] Test loop modes
- [ ] Performance tests

### Phase 7: Documentation & Examples
- [ ] Animation system guide
- [ ] Easing function reference
- [ ] Example: Camera flythrough
- [ ] Example: Product rotation showcase
- [ ] Example: Complex multi-object choreography
- [ ] Example: Material color animation
- [ ] Example: Light intensity pulse

## API Design

### Basic Position Animation

```json
{
  "meshes": [{
    "id": "box",
    "geometry": { "type": "box" },
    "animations": [
      {
        "property": "position.y",
        "keyframes": [
          { "frame": 0, "value": 0, "easing": "easeOutBounce" },
          { "frame": 60, "value": 5, "easing": "easeInQuad" },
          { "frame": 120, "value": 0, "easing": "easeOutBounce" }
        ],
        "loop": "repeat"
      }
    ]
  }]
}
```

### Complex Multi-Property Animation

```json
{
  "meshes": [{
    "id": "product",
    "geometry": { "type": "sphere" },
    "material": { "type": "standard", "color": "#ff0000" },
    "animations": [
      {
        "property": "position",
        "keyframes": [
          { "frame": 0, "value": [0, 0, 0] },
          { "frame": 60, "value": [2, 3, 1], "easing": "easeInOutCubic" },
          { "frame": 120, "value": [0, 0, 0], "easing": "easeInOutCubic" }
        ]
      },
      {
        "property": "rotation.y",
        "keyframes": [
          { "frame": 0, "value": 0 },
          { "frame": 120, "value": 6.28318, "easing": "linear" }
        ]
      },
      {
        "property": "scale",
        "keyframes": [
          { "frame": 0, "value": [1, 1, 1] },
          { "frame": 30, "value": [1.2, 1.2, 1.2], "easing": "easeOutElastic" },
          { "frame": 60, "value": [1, 1, 1], "easing": "easeInOutQuad" }
        ]
      },
      {
        "property": "material.color",
        "keyframes": [
          { "frame": 0, "value": "#ff0000" },
          { "frame": 60, "value": "#00ff00" },
          { "frame": 120, "value": "#0000ff" }
        ]
      }
    ]
  }]
}
```

### Camera Animation

```json
{
  "camera": {
    "type": "perspective",
    "fov": 75,
    "position": [0, 0, 5],
    "animations": [
      {
        "property": "position",
        "keyframes": [
          { "frame": 0, "value": [5, 2, 5] },
          { "frame": 90, "value": [-5, 2, 5], "easing": "easeInOutCubic" },
          { "frame": 180, "value": [0, 5, 0], "easing": "easeInOutCubic" }
        ]
      },
      {
        "property": "fov",
        "keyframes": [
          { "frame": 0, "value": 75 },
          { "frame": 90, "value": 50, "easing": "easeInOutQuad" }
        ]
      }
    ]
  }
}
```

### Custom Bezier Curve

```json
{
  "animations": [{
    "property": "position.y",
    "keyframes": [
      { 
        "frame": 0, 
        "value": 0,
        "bezier": {
          "cp1": [0.42, 0],
          "cp2": [0.58, 1]
        }
      },
      { "frame": 60, "value": 5 }
    ]
  }]
}
```

## Dependencies
- #GAMING-002 (Three.js integration)

## Acceptance Criteria
- [ ] All property types can be animated
- [ ] All easing functions work correctly
- [ ] Bezier curves work correctly
- [ ] Loop modes work correctly
- [ ] Animations are deterministic
- [ ] No performance degradation
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-002 (Three.js integration)
- #GAMING-007 (scripting can control animations)

## Notes
- Consider animation timeline editor UI (future)
- Support importing animations from Blender/Maya (future)
- Add animation presets library
- Consider GLTF animation import
