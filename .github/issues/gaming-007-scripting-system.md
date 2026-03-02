# [GAMING-007] Custom Scripting System with Safe VM Execution

## Overview
Create a safe scripting system that allows custom JavaScript code in templates for game logic, behaviors, and dynamic interactions. Execute scripts in isolated VM with timeout and memory limits.

## Motivation
Enable complex game-like behaviors that can't be expressed in JSON: AI pathfinding, procedural generation, state machines, conditional logic, and frame-by-frame control. Essential for true game scene videos.

## Technical Approach

Use isolated VM execution with whitelisted API surface. Scripts run in sandboxed environment with no access to file system, network, or dangerous APIs.

### Type Definitions

```typescript
// packages/core/src/types/three.ts

export interface ScriptConfig {
  /** Script execution hooks */
  hooks?: {
    /** Called once when scene initializes */
    onInit?: string;
    
    /** Called every frame */
    onFrame?: string;
    
    /** Called when scene is destroyed */
    onDestroy?: string;
  };
  
  /** Reusable behavior functions */
  behaviors?: Record<string, BehaviorScript>;
  
  /** Global variables accessible to all scripts */
  globals?: Record<string, any>;
}

export interface BehaviorScript {
  /** JavaScript function code */
  code: string;
  
  /** Event triggers */
  triggers?: Array<'collision' | 'frame' | 'custom'>;
  
  /** Parameters for the behavior */
  params?: Record<string, any>;
}

export interface ThreeMeshConfig {
  // ... existing properties
  
  /** Per-mesh scripts */
  scripts?: {
    /** Called when mesh is created */
    onInit?: string;
    
    /** Called every frame */
    onUpdate?: string;
    
    /** Called on collision */
    onCollision?: string;
    
    /** Called when mesh is destroyed */
    onDestroy?: string;
    
    /** Behavior references */
    behaviors?: string[]; // IDs from ScriptConfig.behaviors
  };
}

export interface ThreeLayerProps {
  // ... existing properties
  
  /** Scene-level scripts */
  scripts?: ScriptConfig;
}
```

### Script API Surface

```typescript
// packages/scripting/src/ScriptAPI.ts

export interface ScriptAPI {
  // Scene access
  scene: {
    /** Get mesh by ID */
    getById(id: string): MeshProxy | null;
    
    /** Get all meshes */
    getAll(): MeshProxy[];
    
    /** Add new mesh */
    add(config: ThreeMeshConfig): MeshProxy;
    
    /** Remove mesh */
    remove(id: string): void;
    
    /** Get camera */
    getCamera(): CameraProxy;
    
    /** Get lights */
    getLights(): LightProxy[];
  };
  
  // Physics access
  physics: {
    /** Apply force to rigid body */
    applyForce(meshId: string, force: [number, number, number], point?: [number, number, number]): void;
    
    /** Apply impulse */
    applyImpulse(meshId: string, impulse: [number, number, number], point?: [number, number, number]): void;
    
    /** Set velocity */
    setVelocity(meshId: string, velocity: [number, number, number]): void;
    
    /** Raycast */
    raycast(origin: [number, number, number], direction: [number, number, number], maxDistance: number): RaycastHit | null;
    
    /** Get velocity */
    getVelocity(meshId: string): [number, number, number];
  };
  
  // Particles
  particles: {
    /** Emit particles */
    emit(particleSystemId: string, position: [number, number, number], count: number): void;
    
    /** Burst particles */
    burst(particleSystemId: string, position: [number, number, number], count: number): void;
  };
  
  // Math utilities
  math: {
    /** Vector3 operations */
    vec3: {
      add(a: [number, number, number], b: [number, number, number]): [number, number, number];
      subtract(a: [number, number, number], b: [number, number, number]): [number, number, number];
      multiply(v: [number, number, number], scalar: number): [number, number, number];
      dot(a: [number, number, number], b: [number, number, number]): number;
      cross(a: [number, number, number], b: [number, number, number]): [number, number, number];
      normalize(v: [number, number, number]): [number, number, number];
      length(v: [number, number, number]): number;
      distance(a: [number, number, number], b: [number, number, number]): number;
    };
    
    /** Random utilities */
    random: {
      float(min: number, max: number): number;
      int(min: number, max: number): number;
      choice<T>(array: T[]): T;
      vector3(min: [number, number, number], max: [number, number, number]): [number, number, number];
    };
    
    /** Noise functions */
    noise: {
      perlin(x: number, y: number, z: number): number;
      simplex(x: number, y: number, z: number): number;
    };
    
    /** Interpolation */
    lerp(a: number, b: number, t: number): number;
    clamp(value: number, min: number, max: number): number;
    map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
  };
  
  // Time
  time: {
    /** Current frame */
    frame: number;
    
    /** Delta time in seconds */
    deltaTime: number;
    
    /** Total elapsed time */
    elapsed: number;
    
    /** Frames per second */
    fps: number;
  };
  
  // State management
  state: {
    /** Get global state */
    get(key: string): any;
    
    /** Set global state */
    set(key: string, value: any): void;
    
    /** Check if key exists */
    has(key: string): boolean;
  };
  
  // Logging (for debugging)
  console: {
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
  };
}

// Proxy objects (limited access to underlying Three.js objects)
export interface MeshProxy {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
  
  setPosition(position: [number, number, number]): void;
  setRotation(rotation: [number, number, number]): void;
  setScale(scale: [number, number, number]): void;
  setVisible(visible: boolean): void;
  setMaterial(material: Partial<ThreeMaterialConfig>): void;
  destroy(): void;
}
```

### VM Implementation

```typescript
// packages/scripting/src/ScriptRunner.ts

import { VM } from 'vm2';

export class ScriptRunner {
  private vm: VM;
  private api: ScriptAPI;
  private timeout: number;
  
  constructor(api: ScriptAPI, options: ScriptRunnerOptions = {}) {
    this.api = api;
    this.timeout = options.timeout || 100; // 100ms default
    
    this.vm = new VM({
      timeout: this.timeout,
      sandbox: {
        scene: api.scene,
        physics: api.physics,
        particles: api.particles,
        math: api.math,
        time: api.time,
        state: api.state,
        console: api.console,
        // Whitelist safe globals
        Math: Math,
        Array: Array,
        Object: Object,
        JSON: JSON,
        // Block dangerous globals
        require: undefined,
        process: undefined,
        global: undefined,
        eval: undefined,
        Function: undefined,
      },
      eval: false,
      wasm: false,
    });
  }
  
  run(code: string, context?: Record<string, any>): any {
    try {
      // Wrap code in function for better error messages
      const wrappedCode = `
        (function() {
          ${code}
        })()
      `;
      
      // Add context variables to sandbox
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          this.vm.sandbox[key] = value;
        });
      }
      
      return this.vm.run(wrappedCode);
    } catch (error) {
      if (error.message.includes('Script execution timed out')) {
        throw new ScriptTimeoutError(`Script exceeded ${this.timeout}ms timeout`);
      }
      throw new ScriptExecutionError(`Script error: ${error.message}`);
    }
  }
  
  runFunction(code: string, args: any[]): any {
    const wrappedCode = `
      (function(...args) {
        ${code}
      })
    `;
    
    const fn = this.vm.run(wrappedCode);
    return fn(...args);
  }
}

export class ScriptTimeoutError extends Error {}
export class ScriptExecutionError extends Error {}
```

### React Integration

```typescript
// packages/renderer-browser/src/layers/three/ScriptedScene.tsx

export function ScriptedScene({ 
  scripts, 
  frame, 
  deltaTime 
}: ScriptedSceneProps) {
  const scriptRunner = useRef<ScriptRunner | null>(null);
  const api = useScriptAPI();
  
  useEffect(() => {
    if (!scripts) return;
    
    scriptRunner.current = new ScriptRunner(api);
    
    // Run onInit
    if (scripts.hooks?.onInit) {
      try {
        scriptRunner.current.run(scripts.hooks.onInit);
      } catch (error) {
        console.error('Script onInit error:', error);
      }
    }
    
    return () => {
      // Run onDestroy
      if (scripts.hooks?.onDestroy && scriptRunner.current) {
        try {
          scriptRunner.current.run(scripts.hooks.onDestroy);
        } catch (error) {
          console.error('Script onDestroy error:', error);
        }
      }
    };
  }, [scripts]);
  
  useFrame(() => {
    if (!scripts?.hooks?.onFrame || !scriptRunner.current) return;
    
    // Update time context
    api.time.frame = frame;
    api.time.deltaTime = deltaTime;
    
    try {
      scriptRunner.current.run(scripts.hooks.onFrame);
    } catch (error) {
      console.error('Script onFrame error:', error);
    }
  });
  
  return null;
}
```

## Implementation Checklist

### Phase 1: Core Scripting Package
- [ ] Create `@rendervid/scripting` package
- [ ] Add `vm2` dependency (or `isolated-vm` for better performance)
- [ ] Implement `ScriptRunner` class
- [ ] Implement timeout mechanism
- [ ] Implement memory limits
- [ ] Add error handling and reporting

### Phase 2: Script API
- [ ] Implement scene API (getById, add, remove)
- [ ] Implement physics API (forces, impulses, raycast)
- [ ] Implement particles API (emit, burst)
- [ ] Implement math utilities (vec3, random, noise)
- [ ] Implement state management
- [ ] Implement safe console logging

### Phase 3: Proxy Objects
- [ ] Implement `MeshProxy`
- [ ] Implement `CameraProxy`
- [ ] Implement `LightProxy`
- [ ] Ensure proxies prevent direct Three.js access

### Phase 4: React Integration
- [ ] Create `ScriptedScene` component
- [ ] Create `ScriptedMesh` component
- [ ] Integrate with `ThreeLayer`
- [ ] Add script error boundaries

### Phase 5: Behavior Library
- [ ] Create preset behaviors (orbit, follow, bounce, etc.)
- [ ] Implement behavior composition
- [ ] Add behavior parameters

### Phase 6: Testing
- [ ] Unit tests for ScriptRunner
- [ ] Test timeout enforcement
- [ ] Test memory limits
- [ ] Test API surface
- [ ] Test error handling
- [ ] Security tests (ensure sandbox works)

### Phase 7: Documentation & Examples
- [ ] Scripting guide
- [ ] API reference
- [ ] Security best practices
- [ ] Example: Orbiting objects
- [ ] Example: Follow camera
- [ ] Example: Procedural generation
- [ ] Example: AI pathfinding
- [ ] Example: State machine

## API Design

### Basic Frame Script

```json
{
  "type": "three",
  "props": {
    "scripts": {
      "hooks": {
        "onFrame": "const box = scene.getById('box'); box.setRotation([0, time.frame * 0.01, 0]);"
      }
    },
    "meshes": [
      { "id": "box", "geometry": { "type": "box" } }
    ]
  }
}
```

### Collision Response

```json
{
  "meshes": [{
    "id": "ball",
    "geometry": { "type": "sphere" },
    "rigidBody": { "type": "dynamic" },
    "scripts": {
      "onCollision": "if (collision.impulse > 5) { particles.burst('impact', collision.point, 100); }"
    }
  }]
}
```

### Complex Behavior

```json
{
  "scripts": {
    "behaviors": {
      "orbit": {
        "code": "const angle = time.frame * params.speed; const radius = params.radius; mesh.setPosition([Math.cos(angle) * radius, params.height, Math.sin(angle) * radius]);",
        "params": { "speed": 0.02, "radius": 5, "height": 2 }
      }
    }
  },
  "meshes": [{
    "id": "satellite",
    "geometry": { "type": "sphere" },
    "scripts": {
      "behaviors": ["orbit"]
    }
  }]
}
```

### Procedural Generation

```json
{
  "scripts": {
    "hooks": {
      "onInit": "for (let i = 0; i < 100; i++) { const pos = math.random.vector3([-10, 0, -10], [10, 5, 10]); scene.add({ id: 'cube_' + i, geometry: { type: 'box', width: 0.5, height: 0.5, depth: 0.5 }, position: pos, rigidBody: { type: 'dynamic' } }); }"
    }
  }
}
```

### AI Pathfinding

```json
{
  "scripts": {
    "globals": {
      "waypoints": [[0, 0, 0], [5, 0, 5], [10, 0, 0], [5, 0, -5]],
      "currentWaypoint": 0
    },
    "hooks": {
      "onFrame": "const agent = scene.getById('agent'); const target = state.get('waypoints')[state.get('currentWaypoint')]; const distance = math.vec3.distance(agent.position, target); if (distance < 0.5) { state.set('currentWaypoint', (state.get('currentWaypoint') + 1) % state.get('waypoints').length); } const direction = math.vec3.normalize(math.vec3.subtract(target, agent.position)); physics.setVelocity('agent', math.vec3.multiply(direction, 2));"
    }
  }
}
```

## Dependencies
- #GAMING-002 (Three.js integration)
- #GAMING-003 (collision events)

## Acceptance Criteria
- [ ] Scripts execute in isolated VM
- [ ] Timeout enforcement works
- [ ] Memory limits work
- [ ] All API methods functional
- [ ] No security vulnerabilities
- [ ] Error handling is robust
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-002 (Three.js integration)
- #GAMING-003 (collision events)
- #GAMING-004 (particle control)

## Notes
- Consider TypeScript support (compile to JS before execution)
- Add script validation/linting
- Consider visual scripting editor (future)
- Add performance profiling for scripts
- Consider WASM for compute-heavy scripts (future)
