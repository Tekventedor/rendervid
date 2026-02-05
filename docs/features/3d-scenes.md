# 3D Scenes

Create 3D graphics and animations using CSS 3D transforms. The ThreeScene component provides hardware-accelerated 3D rendering without requiring WebGL or external libraries.

## Features

- ✅ **4 Geometry Types** - Box, sphere, torus, and plane
- ✅ **Frame-Aware Animation** - Automatic rotation based on frame progression
- ✅ **Hardware Accelerated** - Uses CSS 3D transforms for GPU rendering
- ✅ **Customizable Lighting** - Ambient, directional, or no lighting
- ✅ **Wireframe Mode** - Toggle between solid and wireframe rendering
- ✅ **No Dependencies** - Pure CSS 3D, no WebGL or Three.js required

## Quick Start

### Basic 3D Box

```json
{
  "layers": [{
    "type": "custom",
    "customComponent": {
      "name": "ThreeScene",
      "props": {
        "geometry": "box",
        "color": "#ff0080",
        "rotation": { "y": 1 }
      }
    }
  }]
}
```

## Geometry Types

### Box

A 3D cube with 6 faces.

```json
{
  "geometry": "box",
  "color": "#4c00ff",
  "scale": 1,
  "wireframe": false
}
```

**Use cases:** Product mockups, dice, containers, geometric design

**Properties:**
- 6 faces with independent transforms
- Supports solid fill or wireframe
- Scales uniformly

---

### Sphere

A sphere approximated with multiple rotated circles.

```json
{
  "geometry": "sphere",
  "color": "#00ffff",
  "scale": 1.2,
  "wireframe": true
}
```

**Use cases:** Planets, balls, orbs, globes, atoms

**Properties:**
- 8 circular rings by default
- Wireframe mode shows ring structure
- Smooth appearance when solid

---

### Torus

A donut-shaped 3D geometry.

```json
{
  "geometry": "torus",
  "color": "#ff8800",
  "scale": 0.8,
  "wireframe": false
}
```

**Use cases:** Rings, halos, portals, abstract design

**Properties:**
- 16 segments for smooth appearance
- Inner radius: 40% of outer radius
- Creates compelling rotation animations

---

### Plane

A flat 2D surface in 3D space.

```json
{
  "geometry": "plane",
  "color": "#00ff80",
  "scale": 1.5,
  "wireframe": true
}
```

**Use cases:** Floors, walls, cards, surfaces

**Properties:**
- Rectangular surface
- Can be rotated in 3D space
- Good for simple backgrounds

## Configuration Options

### Full Configuration

```typescript
interface ThreeSceneProps {
  /** Geometry type */
  geometry: 'box' | 'sphere' | 'torus' | 'plane';

  /** Fill color (default: '#4c00ff') */
  color?: string;

  /** Wireframe mode (default: false) */
  wireframe?: boolean;

  /** Rotation speed in radians/sec per axis (default: {x: 0, y: 0, z: 0}) */
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };

  /** Position offset from center in pixels (default: {x: 0, y: 0, z: 0}) */
  position?: {
    x?: number;
    y?: number;
    z?: number;
  };

  /** Scale multiplier (default: 1) */
  scale?: number;

  /** Camera distance from origin in pixels (default: 500) */
  cameraDistance?: number;

  /** Lighting mode (default: 'directional') */
  lighting?: 'ambient' | 'directional' | 'none';

  /** Scene width in pixels (default: 400) */
  width?: number;

  /** Scene height in pixels (default: 400) */
  height?: number;
}
```

## Rotation

### Automatic Rotation

The `rotation` prop defines rotation speed in radians per second for each axis:

```json
{
  "rotation": {
    "x": 0.5,  // Rotates 0.5 rad/sec around X axis (pitch)
    "y": 1.0,  // Rotates 1.0 rad/sec around Y axis (yaw)
    "z": 0.2   // Rotates 0.2 rad/sec around Z axis (roll)
  }
}
```

**Conversion:**
- 1 radian/sec ≈ 57.3 degrees/sec
- 0.5 rad/sec ≈ 28.6 degrees/sec
- 2 rad/sec ≈ 114.6 degrees/sec

### Rotation Examples

**Slow Y-axis spin:**
```json
{ "rotation": { "y": 0.5 } }
```

**Fast tumble:**
```json
{ "rotation": { "x": 2, "y": 2, "z": 1 } }
```

**Horizontal spin:**
```json
{ "rotation": { "y": 1 } }
```

**Vertical flip:**
```json
{ "rotation": { "x": 1 } }
```

**Diagonal roll:**
```json
{ "rotation": { "x": 1, "z": 1 } }
```

## Lighting

### Lighting Modes

**directional** (default)
- Simulates directional light source
- Adds drop shadow for depth
- Most realistic appearance

```json
{ "lighting": "directional" }
```

**ambient**
- Even lighting from all directions
- Slightly brighter overall
- No shadows

```json
{ "lighting": "ambient" }
```

**none**
- No lighting effects
- Flat appearance
- Pure geometry colors

```json
{ "lighting": "none" }
```

## Usage Examples

### 1. Rotating Logo Cube

```json
{
  "customComponent": {
    "name": "ThreeScene",
    "props": {
      "geometry": "box",
      "color": "#ff0080",
      "rotation": { "y": 1, "x": 0.3 },
      "scale": 1.5,
      "lighting": "directional",
      "width": 600,
      "height": 600
    }
  }
}
```

### 2. Wireframe Sphere

```json
{
  "customComponent": {
    "name": "ThreeScene",
    "props": {
      "geometry": "sphere",
      "color": "#00ffff",
      "wireframe": true,
      "rotation": { "y": 0.5 },
      "scale": 1.2,
      "lighting": "none"
    }
  }
}
```

### 3. Floating Torus

```json
{
  "customComponent": {
    "name": "ThreeScene",
    "props": {
      "geometry": "torus",
      "color": "#ffaa00",
      "rotation": { "x": 0.8, "y": 0.8 },
      "position": { "y": -50 },
      "scale": 1,
      "lighting": "ambient",
      "cameraDistance": 600
    }
  }
}
```

### 4. Animated Background Plane

```json
{
  "customComponent": {
    "name": "ThreeScene",
    "props": {
      "geometry": "plane",
      "color": "#1a1a2e",
      "rotation": { "x": 0.2 },
      "scale": 2,
      "lighting": "none",
      "width": 1920,
      "height": 1080
    }
  }
}
```

### 5. Multi-Object 3D Scene

```json
{
  "layers": [
    {
      "type": "custom",
      "position": { "x": 400, "y": 540 },
      "customComponent": {
        "name": "ThreeScene",
        "props": {
          "geometry": "box",
          "color": "#ff0080",
          "rotation": { "y": 1 },
          "scale": 1
        }
      }
    },
    {
      "type": "custom",
      "position": { "x": 960, "y": 540 },
      "customComponent": {
        "name": "ThreeScene",
        "props": {
          "geometry": "sphere",
          "color": "#00ff80",
          "rotation": { "x": 0.8, "y": 0.8 },
          "scale": 1.2
        }
      }
    },
    {
      "type": "custom",
      "position": { "x": 1520, "y": 540 },
      "customComponent": {
        "name": "ThreeScene",
        "props": {
          "geometry": "torus",
          "color": "#4c00ff",
          "rotation": { "z": 1 },
          "scale": 0.8
        }
      }
    }
  ]
}
```

### 6. Synchronized Rotation

All ThreeScene components use the same `frame` prop, so they stay synchronized:

```json
{
  "layers": [
    {
      "type": "custom",
      "position": { "x": 600, "y": 540 },
      "customComponent": {
        "name": "ThreeScene",
        "props": {
          "geometry": "box",
          "rotation": { "y": 1 },
          "color": "#ff0080"
        }
      }
    },
    {
      "type": "custom",
      "position": { "x": 1320, "y": 540 },
      "customComponent": {
        "name": "ThreeScene",
        "props": {
          "geometry": "box",
          "rotation": { "y": 1 },  // Same rotation speed
          "color": "#00ff80"
        }
      }
    }
  ]
}
```

## Design Tips

### Choosing Geometry

**Box** - Versatile, familiar, stable
- Use for: Products, containers, tech themes
- Works well with: Brand colors, logos on faces

**Sphere** - Organic, global, universal
- Use for: Planets, abstract concepts, data points
- Works well with: Gradients, wireframe mode

**Torus** - Dynamic, hypnotic, modern
- Use for: Abstract design, portals, loading indicators
- Works well with: Neon colors, slow rotation

**Plane** - Simple, clean, utilitarian
- Use for: Backgrounds, cards, minimalist design
- Works well with: Text overlays, UI elements

### Color Selection

**Neon colors** - Futuristic, tech, vibrant
```json
{ "color": "#00ffff" }
{ "color": "#ff0080" }
{ "color": "#ffaa00" }
```

**Pastel colors** - Soft, modern, friendly
```json
{ "color": "#a8dadc" }
{ "color": "#f1faee" }
{ "color": "#e63946" }
```

**Brand colors** - Professional, consistent, recognizable
```json
{ "color": "#1da1f2" }  // Twitter blue
{ "color": "#ff4500" }  // Reddit orange
```

### Rotation Speed

**Slow (0.2-0.5 rad/sec)** - Calm, elegant, background
**Medium (0.5-1.5 rad/sec)** - Engaging, balanced, focal point
**Fast (1.5-3 rad/sec)** - Energetic, dynamic, attention-grabbing

### Scale

- **0.5** - Small, subtle accent
- **1.0** - Standard size
- **1.5** - Large, prominent
- **2.0** - Very large, hero element

## Best Practices

### 1. Use Appropriate Perspective

Adjust `cameraDistance` for desired effect:

```json
// Close-up (dramatic perspective)
{ "cameraDistance": 300 }

// Standard (balanced)
{ "cameraDistance": 500 }

// Far away (subtle perspective)
{ "cameraDistance": 800 }
```

### 2. Combine with Other Layers

3D objects work great with text and shapes:

```json
{
  "layers": [
    {
      "type": "custom",
      "customComponent": {
        "name": "ThreeScene",
        "props": { "geometry": "box", "color": "#ff0080" }
      }
    },
    {
      "type": "text",
      "position": { "x": 960, "y": 900 },
      "props": {
        "text": "Innovation",
        "fontSize": 72,
        "fontWeight": 700,
        "color": "#ffffff"
      }
    }
  ]
}
```

### 3. Match Lighting to Scene

```json
// Dark scene - use ambient or directional
{ "backgroundColor": "#000000", "lighting": "directional" }

// Light scene - use none or ambient
{ "backgroundColor": "#ffffff", "lighting": "ambient" }
```

### 4. Optimize Performance

- Use fewer simultaneous 3D objects (max 3-5)
- Prefer lower resolution for background elements
- Use `wireframe: true` for complex geometries

### 5. Experiment with Composition

Position multiple objects for depth:

```json
{
  "layers": [
    // Background
    { "position": { "x": 960, "y": 540, "z": -200 }, "scale": 2 },
    // Middle
    { "position": { "x": 800, "y": 400 }, "scale": 1 },
    // Foreground
    { "position": { "x": 1100, "y": 600, "z": 100 }, "scale": 0.8 }
  ]
}
```

## Performance

### Rendering Speed

ThreeScene render times (400x400, 30fps):
- Box: ~10ms per frame
- Sphere (solid): ~12ms per frame
- Sphere (wireframe): ~18ms per frame
- Torus: ~20ms per frame
- Plane: ~8ms per frame

### Optimization Tips

1. **Reduce scene size** for background elements:
   ```json
   { "width": 200, "height": 200 }
   ```

2. **Use solid over wireframe** when possible (faster rendering)

3. **Limit simultaneous rotations**:
   ```json
   // ✅ Good - One axis
   { "rotation": { "y": 1 } }

   // ⚠️ Slower - Three axes
   { "rotation": { "x": 1, "y": 1, "z": 1 } }
   ```

4. **Lower FPS for background objects** (handled by renderer)

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS 3D Transforms | ✅ | ✅ | ✅ | ✅ |
| transform-style: preserve-3d | ✅ | ✅ | ✅ | ✅ |
| perspective | ✅ | ✅ | ✅ | ✅ |
| clip-path | ✅ | ✅ | ✅ | ✅ |

### Headless Chrome
- ✅ Full 3D support
- ✅ Hardware acceleration available
- ✅ Identical rendering to browser

## Limitations

### CSS 3D vs WebGL

**CSS 3D (ThreeScene):**
- ✅ No dependencies
- ✅ Simple API
- ✅ Fast for basic shapes
- ❌ Limited to basic geometries
- ❌ No complex lighting
- ❌ No textures

**WebGL (Three.js, React Three Fiber):**
- ✅ Unlimited geometry complexity
- ✅ Realistic lighting and shadows
- ✅ Texture mapping
- ❌ Large bundle size
- ❌ Complex API
- ❌ May not work in headless environments

For complex 3D scenes, consider using Three.js with custom components (see issue #29).

## Troubleshooting

### 3D Object Not Visible

**Problem:** ThreeScene component renders but nothing shows

**Solutions:**
1. Check `color` is different from `backgroundColor`
2. Verify `scale` is not 0 or too small
3. Increase `cameraDistance` if object is too close
4. Check `width` and `height` are reasonable (> 100)

### Rotation Not Smooth

**Problem:** Rotation appears choppy or stuttering

**Solutions:**
1. Increase FPS: `output.fps = 60`
2. Reduce number of simultaneous 3D objects
3. Use solid instead of wireframe rendering
4. Verify `rotation` values are reasonable (< 3 rad/sec)

### Object Appears Flat

**Problem:** 3D object doesn't look 3D

**Solutions:**
1. Check `rotation` is set (objects need to rotate to show depth)
2. Verify `lighting` is not `none` (lighting enhances depth perception)
3. Increase `cameraDistance` for less extreme perspective
4. Use `directional` lighting for shadows

## Examples

Complete 3D scene examples:
- `examples/3d/` - All geometry types demonstrated
- `examples/custom-components/3d-cube-rotation/` - Advanced 3D cube
- `packages/components/src/effects/ThreeScene.tsx` - Source code

## API Reference

```typescript
// Import the component
import { ThreeScene } from '@rendervid/components';

// TypeScript definitions
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface ThreeSceneProps extends AnimatedProps {
  geometry: 'box' | 'sphere' | 'torus' | 'plane';
  color?: string;
  wireframe?: boolean;
  rotation?: Partial<Vector3>;
  position?: Partial<Vector3>;
  scale?: number;
  cameraDistance?: number;
  lighting?: 'ambient' | 'directional' | 'none';
  width?: number;
  height?: number;
}
```

See TypeScript definitions in `@rendervid/components` for complete API documentation.
