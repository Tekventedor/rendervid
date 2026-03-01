# [GAMING-008] PixiJS 2D Layer Integration

## Overview
Create a new `"type": "pixi"` layer that integrates PixiJS for high-performance 2D game-style graphics: sprites, tilemaps, 2D particles, and filters.

## Motivation
Enable 2D game aesthetics for marketing videos: retro games, platformers, arcade-style animations, pixel art, and 2D motion graphics. PixiJS is the industry standard for 2D WebGL rendering.

## Technical Approach

Integrate PixiJS as a new layer type alongside Three.js, with its own rendering pipeline and features optimized for 2D.

### Type Definitions

```typescript
// packages/core/src/types/pixi.ts

export interface PixiLayer extends LayerBase {
  type: 'pixi';
  props: PixiLayerProps;
}

export interface PixiLayerProps {
  /** Background color */
  backgroundColor?: Color;
  
  /** Sprites in the scene */
  sprites?: PixiSprite[];
  
  /** Tilemaps */
  tilemaps?: PixiTilemap[];
  
  /** 2D particle systems */
  particles?: PixiParticleSystem[];
  
  /** Graphics (vector shapes) */
  graphics?: PixiGraphic[];
  
  /** Text objects */
  texts?: PixiText[];
  
  /** Filters (post-processing) */
  filters?: PixiFilter[];
  
  /** 2D physics */
  physics?: {
    enabled: boolean;
    engine: 'matter';
    gravity?: { x: number; y: number };
  };
}

export interface PixiSprite {
  id: string;
  
  /** Texture source */
  texture: string; // URL or data URI
  
  /** Position in pixels */
  position: [number, number];
  
  /** Anchor point (0-1) */
  anchor?: [number, number];
  
  /** Scale */
  scale?: [number, number] | number;
  
  /** Rotation in radians */
  rotation?: number;
  
  /** Opacity */
  alpha?: number;
  
  /** Tint color */
  tint?: Color;
  
  /** Blend mode */
  blendMode?: 'normal' | 'add' | 'multiply' | 'screen';
  
  /** Sprite sheet animation */
  animation?: {
    /** Frame definitions */
    frames: SpriteFrame[];
    
    /** Current animation */
    current?: string;
    
    /** Animations */
    animations: Record<string, SpriteAnimation>;
  };
  
  /** Physics body */
  rigidBody?: {
    type: 'dynamic' | 'static' | 'kinematic';
    mass?: number;
    friction?: number;
    restitution?: number;
    velocity?: [number, number];
  };
  
  /** Keyframe animations */
  animations?: KeyframeAnimation[];
}

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteAnimation {
  frames: number[]; // Frame indices
  speed: number; // Frames per second
  loop?: boolean;
}

export interface PixiTilemap {
  id: string;
  
  /** Tileset texture */
  tileset: string;
  
  /** Tile size in pixels */
  tileSize: [number, number];
  
  /** Map data (2D array of tile indices) */
  map: number[][];
  
  /** Position */
  position?: [number, number];
  
  /** Collision layer (for physics) */
  collision?: boolean[][];
}

export interface PixiParticleSystem {
  id: string;
  
  /** Particle texture */
  texture: string;
  
  /** Emitter configuration */
  emitter: {
    type: 'point' | 'rectangle' | 'circle';
    position: [number, number];
    size?: [number, number]; // For rectangle
    radius?: number; // For circle
    rate?: number; // Particles per second
    burst?: Array<{ frame: number; count: number }>;
  };
  
  /** Particle properties */
  particle: {
    lifetime: number | { min: number; max: number };
    speed: number | { min: number; max: number };
    angle: number | { min: number; max: number };
    scale: number | { start: number; end: number };
    alpha: number | { start: number; end: number };
    color?: string | { start: string; end: string };
    rotation?: number | { min: number; max: number };
    rotationSpeed?: number | { min: number; max: number };
  };
  
  /** Forces */
  forces?: Array<{
    type: 'gravity' | 'wind';
    strength: number;
    direction?: [number, number];
  }>;
}

export interface PixiGraphic {
  id: string;
  
  /** Shape type */
  shape: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'line';
  
  /** Position */
  position: [number, number];
  
  /** Shape-specific properties */
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  points?: number[];
  
  /** Fill */
  fill?: {
    color: Color;
    alpha?: number;
  };
  
  /** Stroke */
  stroke?: {
    color: Color;
    width: number;
    alpha?: number;
  };
  
  /** Animations */
  animations?: KeyframeAnimation[];
}

export interface PixiText {
  id: string;
  
  /** Text content */
  text: string;
  
  /** Position */
  position: [number, number];
  
  /** Style */
  style: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fill?: Color | string[];
    stroke?: Color;
    strokeThickness?: number;
    align?: 'left' | 'center' | 'right';
    wordWrap?: boolean;
    wordWrapWidth?: number;
    dropShadow?: boolean;
    dropShadowColor?: Color;
    dropShadowBlur?: number;
    dropShadowAngle?: number;
    dropShadowDistance?: number;
  };
  
  /** Anchor */
  anchor?: [number, number];
  
  /** Animations */
  animations?: KeyframeAnimation[];
}

export type PixiFilter = 
  | { type: 'blur'; strength?: number }
  | { type: 'glow'; color?: Color; distance?: number; outerStrength?: number }
  | { type: 'pixelate'; size?: number }
  | { type: 'colorMatrix'; matrix?: number[] }
  | { type: 'displacement'; texture: string; scale?: [number, number] }
  | { type: 'noise'; noise?: number; seed?: number }
  | { type: 'oldFilm'; sepia?: number; noise?: number; scratch?: number }
  | { type: 'crt'; curvature?: number; lineWidth?: number; lineContrast?: number }
  | { type: 'glitch'; slices?: number; offset?: number; direction?: number };
```

### Implementation

```typescript
// packages/renderer-browser/src/layers/PixiLayer.tsx

import * as PIXI from 'pixi.js';
import { useEffect, useRef } from 'react';

export function PixiLayer({ layer, frame, fps }: PixiLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const spritesRef = useRef<Map<string, PIXI.Sprite>>(new Map());
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize PixiJS
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: layer.size.width,
      height: layer.size.height,
      backgroundColor: layer.props.backgroundColor || 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    
    appRef.current = app;
    
    // Load textures and create sprites
    initializeScene(app, layer.props);
    
    return () => {
      app.destroy(true);
    };
  }, []);
  
  useEffect(() => {
    if (!appRef.current) return;
    
    // Update animations
    updateAnimations(appRef.current, spritesRef.current, frame, fps);
    
    // Render frame
    appRef.current.render();
  }, [frame]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        left: layer.position.x,
        top: layer.position.y,
      }}
    />
  );
}

async function initializeScene(app: PIXI.Application, props: PixiLayerProps) {
  // Load textures
  const textures = new Map<string, PIXI.Texture>();
  
  for (const sprite of props.sprites || []) {
    if (!textures.has(sprite.texture)) {
      const texture = await PIXI.Texture.fromURL(sprite.texture);
      textures.set(sprite.texture, texture);
    }
  }
  
  // Create sprites
  for (const spriteConfig of props.sprites || []) {
    const texture = textures.get(spriteConfig.texture)!;
    const sprite = new PIXI.Sprite(texture);
    
    sprite.position.set(...spriteConfig.position);
    sprite.anchor.set(...(spriteConfig.anchor || [0.5, 0.5]));
    
    if (typeof spriteConfig.scale === 'number') {
      sprite.scale.set(spriteConfig.scale);
    } else if (spriteConfig.scale) {
      sprite.scale.set(...spriteConfig.scale);
    }
    
    if (spriteConfig.rotation) {
      sprite.rotation = spriteConfig.rotation;
    }
    
    if (spriteConfig.alpha !== undefined) {
      sprite.alpha = spriteConfig.alpha;
    }
    
    if (spriteConfig.tint) {
      sprite.tint = PIXI.utils.string2hex(spriteConfig.tint);
    }
    
    app.stage.addChild(sprite);
  }
  
  // Create tilemaps
  for (const tilemapConfig of props.tilemaps || []) {
    const tilemap = await createTilemap(tilemapConfig, textures);
    app.stage.addChild(tilemap);
  }
  
  // Apply filters
  if (props.filters && props.filters.length > 0) {
    app.stage.filters = props.filters.map(createFilter);
  }
}
```

## Implementation Checklist

### Phase 1: Core Package Setup
- [ ] Create PixiJS layer type in `@rendervid/core`
- [ ] Add `pixi.js` dependency to renderer packages
- [ ] Create type definitions

### Phase 2: Basic Rendering
- [ ] Implement `PixiLayer` component
- [ ] Support sprite rendering
- [ ] Support texture loading
- [ ] Support basic transformations (position, rotation, scale)
- [ ] Support blend modes and tint

### Phase 3: Sprite Animations
- [ ] Implement sprite sheet parsing
- [ ] Implement animation playback
- [ ] Support multiple animations per sprite
- [ ] Support animation events

### Phase 4: Tilemaps
- [ ] Implement tilemap rendering
- [ ] Support multiple layers
- [ ] Support collision detection
- [ ] Optimize rendering (culling)

### Phase 5: 2D Particles
- [ ] Implement particle emitters
- [ ] Support particle forces
- [ ] Optimize for thousands of particles
- [ ] Support texture atlases

### Phase 6: Filters
- [ ] Implement blur filter
- [ ] Implement glow filter
- [ ] Implement pixelate filter
- [ ] Implement CRT/retro filters
- [ ] Implement glitch filter
- [ ] Support custom filters

### Phase 7: 2D Physics (Matter.js)
- [ ] Integrate Matter.js
- [ ] Sync sprites with physics bodies
- [ ] Support collision detection
- [ ] Support joints and constraints

### Phase 8: Testing
- [ ] Unit tests for sprite rendering
- [ ] Test animations
- [ ] Test tilemaps
- [ ] Test particles
- [ ] Performance tests

### Phase 9: Documentation & Examples
- [ ] PixiJS layer guide
- [ ] Example: Platformer scene
- [ ] Example: Arcade game
- [ ] Example: Pixel art animation
- [ ] Example: Retro CRT effect
- [ ] Example: 2D particle effects

## API Design

### Basic Sprite

```json
{
  "type": "pixi",
  "props": {
    "backgroundColor": "#1a1a2e",
    "sprites": [
      {
        "id": "character",
        "texture": "character.png",
        "position": [400, 300],
        "scale": 2,
        "animations": [
          {
            "property": "position.x",
            "keyframes": [
              { "frame": 0, "value": 100 },
              { "frame": 120, "value": 700, "easing": "easeInOutQuad" }
            ]
          }
        ]
      }
    ]
  }
}
```

### Sprite Sheet Animation

```json
{
  "sprites": [{
    "id": "player",
    "texture": "spritesheet.png",
    "position": [400, 300],
    "animation": {
      "frames": [
        { "x": 0, "y": 0, "width": 32, "height": 32 },
        { "x": 32, "y": 0, "width": 32, "height": 32 },
        { "x": 64, "y": 0, "width": 32, "height": 32 }
      ],
      "animations": {
        "walk": { "frames": [0, 1, 2], "speed": 10, "loop": true },
        "idle": { "frames": [0], "speed": 1, "loop": true }
      },
      "current": "walk"
    }
  }]
}
```

### Tilemap

```json
{
  "tilemaps": [{
    "id": "level1",
    "tileset": "tiles.png",
    "tileSize": [32, 32],
    "position": [0, 0],
    "map": [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 3, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ]
  }]
}
```

### Particles

```json
{
  "particles": [{
    "id": "explosion",
    "texture": "particle.png",
    "emitter": {
      "type": "point",
      "position": [400, 300],
      "burst": [{ "frame": 60, "count": 100 }]
    },
    "particle": {
      "lifetime": 1,
      "speed": { "min": 50, "max": 200 },
      "angle": { "min": 0, "max": 6.28 },
      "scale": { "start": 1, "end": 0 },
      "alpha": { "start": 1, "end": 0 }
    },
    "forces": [
      { "type": "gravity", "strength": 100 }
    ]
  }]
}
```

### Filters

```json
{
  "filters": [
    { "type": "pixelate", "size": 4 },
    { "type": "crt", "curvature": 3, "lineWidth": 1 },
    { "type": "glow", "color": "#00ff00", "distance": 10 }
  ]
}
```

## Dependencies
None (independent layer type)

## Acceptance Criteria
- [ ] PixiJS renders correctly
- [ ] Sprite animations work
- [ ] Tilemaps render efficiently
- [ ] Particles perform well (1000+)
- [ ] All filters work
- [ ] Works in browser and Node.js
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-009 (2D physics with Matter.js)

## Notes
- Consider Aseprite file format support
- Add sprite packing tool integration
- Support for Tiled map editor format
- Consider WebGL shader support for custom effects
