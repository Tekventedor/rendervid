# 3D Examples

Examples demonstrating the Three.js layer for creating stunning 3D graphics and animations.

## Overview

The Three.js layer enables you to create professional 3D scenes with:

- Multiple geometry types (box, sphere, cylinder, cone, torus, plane, GLTF models, 3D text)
- Physically-based rendering (PBR) materials
- Advanced lighting (ambient, directional, point, spot, hemisphere)
- Real-time shadows and fog
- Auto-rotation and frame-based animations
- Texture mapping

## Examples

### 1. Basic Rotating Cube

**Level:** Beginner
**Duration:** 5 seconds

A simple introduction to the Three.js layer with a rotating cube.

**Features:**
- Box geometry
- Standard PBR material
- Ambient and directional lighting
- Auto-rotation
- Entrance animation

**Key Learning:**
- Basic Three.js layer structure
- Camera and light setup
- Auto-rotation property
- Material metalness and roughness

[View Example →](./basic-rotating-cube/)

---

### 2. Product Showcase

**Level:** Intermediate
**Duration:** 8 seconds

Professional product visualization with studio lighting and shadows.

**Features:**
- High-poly sphere geometry
- Physical material with clearcoat
- Four-light studio setup
- Real-time soft shadows
- HDR tone mapping
- Floor and backdrop

**Key Learning:**
- Studio lighting techniques
- Shadow configuration
- Physical material properties
- Professional presentation

[View Example →](./product-showcase/)

---

### 3. Multi-Object Scene

**Level:** Advanced
**Duration:** 10 seconds

Complex scene with multiple objects, materials, and coordinated animations.

**Features:**
- 8 mesh objects with 5 geometry types
- Varied materials and colors
- Four-light setup with colored accents
- Atmospheric fog
- Coordinated auto-rotation
- Shadow casting and receiving

**Key Learning:**
- Scene composition
- Multiple object management
- Fog effects
- Complex lighting setups
- Animation coordination

[View Example →](./multi-object-scene/)

---

### 4. 3D Text

**Level:** Advanced
**Duration:** 6 seconds

Extruded 3D text with dramatic lighting and metallic finish.

**Features:**
- Text3D geometry with bevels
- Physical material with clearcoat
- Five-light dramatic setup
- Spotlight with soft edges
- Emissive glow
- Cinematic presentation

**Key Learning:**
- 3D text rendering
- Font loading
- Advanced materials
- Dramatic lighting
- Spotlight usage

[View Example →](./text-3d/)

---

### Legacy CSS 3D Examples

The following examples use the older CSS 3D ThreeScene component:

- [rotating-cube](./rotating-cube/) - CSS 3D rotating cube
- [sphere-animation](./sphere-animation/) - CSS 3D wireframe sphere

These are kept for backward compatibility. New projects should use the Three.js layer examples above.

## Quick Start

Run any example using:

```bash
pnpm run examples:render 3d/<example-name>
```

Examples:
```bash
pnpm run examples:render 3d/basic-rotating-cube
pnpm run examples:render 3d/product-showcase
pnpm run examples:render 3d/multi-object-scene
pnpm run examples:render 3d/text-3d
```

## Common Patterns

### Basic Scene Structure

```json
{
  "type": "three",
  "props": {
    "camera": { "type": "perspective", "fov": 75, "position": [0, 0, 5] },
    "lights": [
      { "type": "ambient", "intensity": 0.5 },
      { "type": "directional", "position": [5, 5, 5], "intensity": 1 }
    ],
    "meshes": [
      {
        "id": "object",
        "geometry": { "type": "box" },
        "material": { "type": "standard", "color": "#ff0000" }
      }
    ]
  }
}
```

### Auto-Rotation

Add smooth rotation to any mesh:

```json
"autoRotate": [0.01, 0.02, 0]
// [x, y, z] rotation in radians per frame
```

### Studio Lighting

Professional three-point lighting:

```json
"lights": [
  { "type": "directional", "intensity": 1.5, "position": [10, 10, 5], "castShadow": true },
  { "type": "directional", "intensity": 0.3, "position": [-5, 3, -2] },
  { "type": "ambient", "intensity": 0.2 }
]
```

### Shadows

Enable realistic shadows:

```json
"shadows": { "enabled": true, "type": "pcfsoft" },
"lights": [
  { "type": "directional", "castShadow": true, "shadowMapSize": 2048 }
],
"meshes": [
  { "castShadow": true, "receiveShadow": true }
]
```

## Material Presets

### Plastic
```json
{ "type": "standard", "metalness": 0, "roughness": 0.5 }
```

### Metal
```json
{ "type": "standard", "metalness": 1, "roughness": 0.2 }
```

### Glass
```json
{ "type": "physical", "metalness": 0, "roughness": 0, "transmission": 1 }
```

### Rubber
```json
{ "type": "standard", "metalness": 0, "roughness": 0.9 }
```

### Chrome
```json
{ "type": "physical", "metalness": 1, "roughness": 0.05, "clearcoat": 1 }
```

## Geometry Types

| Type | Use Case | Complexity |
|------|----------|------------|
| `box` | Cubes, containers, buildings | Low |
| `sphere` | Balls, planets, orbs | Medium |
| `cylinder` | Pillars, cans, tubes | Medium |
| `cone` | Arrows, hats, mountains | Medium |
| `torus` | Rings, donuts, portals | Medium |
| `plane` | Floors, walls, cards | Low |
| `gltf` | Complex models, characters | Variable |
| `text3d` | Logos, titles, text | High |

## Light Types

| Type | Effect | Best For |
|------|--------|----------|
| `ambient` | Uniform illumination | Base lighting |
| `directional` | Parallel rays + shadows | Main light |
| `point` | Omnidirectional | Accent lights |
| `spot` | Cone-shaped | Focused lighting |
| `hemisphere` | Sky/ground gradient | Outdoor scenes |

## Performance Tips

1. **Optimize Geometry:**
   - Use lower segment counts when possible
   - Combine static meshes

2. **Texture Optimization:**
   - Use power-of-2 sizes (256, 512, 1024, 2048)
   - Compress textures (JPG for color)

3. **Lighting:**
   - Limit real-time shadows
   - Use 1-3 lights for best balance

4. **Materials:**
   - `basic` - fastest (no lighting)
   - `standard` - good balance
   - `physical` - highest quality (slowest)

## Best Practices

### Camera Position

```javascript
// Product shots - less distortion
fov: 50, position: [0, 2, 8]

// Dramatic perspective
fov: 90, position: [0, 0, 5]

// Isometric-like
fov: 35, position: [10, 10, 10]
```

### Lighting Ratios

```javascript
// Dramatic (high contrast)
Key: 2.0, Fill: 0.3, Ambient: 0.2

// Balanced (natural)
Key: 1.5, Fill: 0.5, Ambient: 0.6

// Soft (even lighting)
Key: 1.0, Fill: 0.8, Ambient: 0.8
```

### Shadow Quality

```javascript
// Basic - fast, hard shadows
type: 'basic', shadowMapSize: 512

// Good - balanced
type: 'pcf', shadowMapSize: 1024

// Best - slow, soft shadows
type: 'pcfsoft', shadowMapSize: 2048
```

## Troubleshooting

### Scene is black
- Add lights (at minimum ambient light)
- Check camera position
- Verify mesh positions are in view

### Shadows not appearing
- Enable in props: `shadows: { enabled: true }`
- Set `castShadow: true` on lights
- Set both `castShadow` and `receiveShadow` on meshes

### Performance issues
- Reduce geometry segments
- Lower shadow map size
- Use fewer lights
- Simplify materials

### Objects not centered
- Adjust camera `lookAt` property
- Check mesh positions
- Use negative position for text3d

## Documentation

- [Three.js Layer Guide](/docs/layers/three-layer.md) - Complete documentation
- [Three.js Types API](/docs/api/three-types.md) - TypeScript reference
- [Layer Types](/docs/features/layer-types.md) - All layer types

## Resources

### Learning Three.js
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Journey](https://threejs-journey.com/) - Excellent course

### 3D Models
- [Sketchfab](https://sketchfab.com/) - Free and paid models
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)

### Textures
- [Poly Haven](https://polyhaven.com/) - Free PBR textures
- [Texture Haven](https://texturehaven.com/)
- [CC0 Textures](https://cc0textures.com/)

### Fonts (for 3D text)
- [facetype.js](http://gero3.github.io/facetype.js/) - Convert fonts
- [Three.js Fonts](https://threejs.org/examples/?q=font) - Pre-converted fonts

## Next Steps

1. Start with **Basic Rotating Cube** to learn fundamentals
2. Move to **Product Showcase** for lighting techniques
3. Try **Multi-Object Scene** for complex compositions
4. Experiment with **3D Text** for typography effects

Then create your own scenes by mixing and matching concepts from all examples!

## Support

For questions or issues:
- Check the [Troubleshooting Guide](/docs/guides/troubleshooting.md)
- Review the [API Reference](/docs/api/three-types.md)
- Open an issue on GitHub
