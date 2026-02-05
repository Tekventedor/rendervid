# Three.js Layer

The Three.js layer enables you to create stunning 3D graphics and animations in your videos using the powerful Three.js library. This layer provides a declarative API for setting up 3D scenes with cameras, lights, meshes, and materials.

## Quick Start

Here's a simple example of a rotating 3D cube:

```json
{
  "layers": [
    {
      "id": "my-3d-scene",
      "type": "three",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 1920, "height": 1080 },
      "props": {
        "camera": {
          "type": "perspective",
          "fov": 75,
          "position": [0, 0, 5]
        },
        "lights": [
          { "type": "ambient", "intensity": 0.5 },
          { "type": "directional", "position": [5, 5, 5], "intensity": 1 }
        ],
        "meshes": [
          {
            "id": "cube",
            "geometry": { "type": "box", "width": 2, "height": 2, "depth": 2 },
            "material": {
              "type": "standard",
              "color": "#ff6b6b",
              "metalness": 0.3,
              "roughness": 0.4
            },
            "autoRotate": [0.01, 0.02, 0]
          }
        ]
      }
    }
  ]
}
```

## Features

- Multiple geometry types (box, sphere, cylinder, cone, torus, plane, GLTF models, 3D text)
- Physically-based rendering (PBR) materials
- Multiple light types (ambient, directional, point, spot, hemisphere)
- Perspective and orthographic cameras
- Shadows and fog effects
- Texture mapping
- Auto-rotation and frame-based animations
- GLTF/GLB model loading
- 3D text rendering

## Camera Configuration

### Perspective Camera

The most common camera type, mimics how the human eye sees the world with perspective distortion.

```json
{
  "camera": {
    "type": "perspective",
    "fov": 75,
    "near": 0.1,
    "far": 1000,
    "position": [0, 2, 5],
    "lookAt": [0, 0, 0]
  }
}
```

**Properties:**
- `type` (required): `"perspective"`
- `fov`: Field of view in degrees (default: 75)
- `near`: Near clipping plane (default: 0.1)
- `far`: Far clipping plane (default: 1000)
- `position`: Camera position [x, y, z] (default: [0, 0, 5])
- `lookAt`: Point to look at [x, y, z] (optional)

**Tips:**
- Use `fov: 50-60` for more realistic perspective
- Use `fov: 90-120` for wide-angle/dramatic effects
- Place camera further back and use lower FOV for product shots

### Orthographic Camera

A camera without perspective distortion, useful for technical drawings or isometric views.

```json
{
  "camera": {
    "type": "orthographic",
    "left": -10,
    "right": 10,
    "top": 10,
    "bottom": -10,
    "position": [5, 5, 5],
    "lookAt": [0, 0, 0]
  }
}
```

**Properties:**
- `type` (required): `"orthographic"`
- `left`, `right`, `top`, `bottom`: Frustum bounds
- `near`: Near clipping plane (default: 0.1)
- `far`: Far clipping plane (default: 1000)
- `position`: Camera position [x, y, z]
- `lookAt`: Point to look at [x, y, z]

**Tips:**
- Use for isometric views in architectural/technical visualizations
- Adjust frustum bounds based on scene size
- Useful when you need consistent object sizes regardless of depth

## Lighting

### Ambient Light

Uniform lighting that illuminates all objects equally from all directions.

```json
{
  "type": "ambient",
  "color": "#ffffff",
  "intensity": 0.5
}
```

**Use cases:**
- Base lighting to prevent completely dark areas
- Soft fill light
- Combine with directional lights for balanced lighting

### Directional Light

Parallel light rays like sunlight. Creates defined shadows.

```json
{
  "type": "directional",
  "color": "#ffffff",
  "intensity": 1,
  "position": [5, 10, 5],
  "target": [0, 0, 0],
  "castShadow": true,
  "shadowMapSize": 2048
}
```

**Properties:**
- `position`: Light source position
- `target`: Where the light points (optional)
- `castShadow`: Enable shadow casting (default: false)
- `shadowMapSize`: Shadow quality, power of 2 (default: 1024)

**Use cases:**
- Main key light for dramatic lighting
- Simulating sunlight
- Creating defined shadows

### Point Light

Light emanating from a single point in all directions, like a light bulb.

```json
{
  "type": "point",
  "color": "#ffaa00",
  "intensity": 1,
  "position": [0, 5, 0],
  "distance": 50,
  "decay": 2,
  "castShadow": true
}
```

**Properties:**
- `distance`: Maximum range (0 = infinite)
- `decay`: Light falloff rate (default: 2)
- `castShadow`: Enable shadows

**Use cases:**
- Indoor lighting (lamps, candles)
- Accent lighting
- Creating light halos/glows

### Spot Light

Cone-shaped light emanating from a point.

```json
{
  "type": "spot",
  "color": "#ffffff",
  "intensity": 1,
  "position": [0, 10, 0],
  "target": [0, 0, 0],
  "angle": 0.5,
  "penumbra": 0.2,
  "distance": 100,
  "decay": 2,
  "castShadow": true
}
```

**Properties:**
- `angle`: Cone angle in radians (default: π/3)
- `penumbra`: Edge softness 0-1 (default: 0)
- `distance`: Maximum range
- `decay`: Light falloff rate

**Use cases:**
- Stage lighting
- Flashlight effects
- Focused dramatic lighting

### Hemisphere Light

Two-color gradient light (sky and ground).

```json
{
  "type": "hemisphere",
  "color": "#87ceeb",
  "groundColor": "#362907",
  "intensity": 0.6,
  "position": [0, 50, 0]
}
```

**Use cases:**
- Natural outdoor lighting
- Sky/ground color simulation
- Subtle ambient variation

## Geometry Types

### Box

```json
{
  "type": "box",
  "width": 2,
  "height": 2,
  "depth": 2,
  "widthSegments": 1,
  "heightSegments": 1,
  "depthSegments": 1
}
```

### Sphere

```json
{
  "type": "sphere",
  "radius": 1,
  "widthSegments": 32,
  "heightSegments": 16
}
```

Higher segment counts create smoother spheres but impact performance.

### Cylinder

```json
{
  "type": "cylinder",
  "radiusTop": 1,
  "radiusBottom": 1,
  "height": 2,
  "radialSegments": 32,
  "heightSegments": 1,
  "openEnded": false
}
```

Set `radiusTop: 0` to create a cone shape.

### Cone

```json
{
  "type": "cone",
  "radius": 1,
  "height": 2,
  "radialSegments": 32,
  "heightSegments": 1,
  "openEnded": false
}
```

### Torus

A donut shape.

```json
{
  "type": "torus",
  "radius": 1,
  "tube": 0.4,
  "radialSegments": 16,
  "tubularSegments": 100,
  "arc": 6.283185307179586
}
```

### Plane

A flat 2D surface.

```json
{
  "type": "plane",
  "width": 5,
  "height": 5,
  "widthSegments": 1,
  "heightSegments": 1
}
```

### GLTF Model

Load external 3D models in GLTF/GLB format.

```json
{
  "type": "gltf",
  "url": "https://example.com/model.glb",
  "scale": 1,
  "autoPlay": true,
  "animationIndex": 0,
  "animationSpeed": 1
}
```

**Properties:**
- `url`: Path to GLTF/GLB file (can be URL or local path)
- `scale`: Uniform scale multiplier
- `autoPlay`: Auto-play embedded animations
- `animationIndex`: Which animation to play (index or name)
- `animationSpeed`: Playback speed multiplier

### 3D Text

Extruded 3D text geometry.

```json
{
  "type": "text3d",
  "text": "Hello 3D!",
  "font": "https://example.com/font.json",
  "size": 1,
  "height": 0.2,
  "curveSegments": 12,
  "bevelEnabled": true,
  "bevelThickness": 0.03,
  "bevelSize": 0.02,
  "bevelSegments": 3
}
```

**Note:** Requires Three.js JSON format fonts. Convert TTF/OTF fonts using [facetype.js](http://gero3.github.io/facetype.js/).

## Materials

### Standard Material (PBR)

Physically-based rendering material with metalness/roughness workflow.

```json
{
  "type": "standard",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 1,
  "opacity": 1,
  "transparent": false,
  "emissive": "#000000",
  "emissiveIntensity": 1
}
```

**Properties:**
- `metalness`: 0 = dielectric, 1 = metallic
- `roughness`: 0 = smooth/shiny, 1 = rough/matte
- `map`: Base color texture
- `normalMap`: Surface detail texture
- `roughnessMap`: Roughness variation texture
- `metalnessMap`: Metalness variation texture
- `aoMap`: Ambient occlusion texture
- `emissiveMap`: Glow map texture
- `envMap`: Environment reflection texture

**Material Presets:**

Plastic:
```json
{ "metalness": 0, "roughness": 0.5 }
```

Metal:
```json
{ "metalness": 1, "roughness": 0.2 }
```

Rubber:
```json
{ "metalness": 0, "roughness": 0.9 }
```

Glass (with physical material):
```json
{ "metalness": 0, "roughness": 0, "transmission": 1 }
```

### Basic Material

Simple unlit material, not affected by lights.

```json
{
  "type": "basic",
  "color": "#ff0000",
  "opacity": 1,
  "transparent": false
}
```

**Use cases:**
- UI elements
- Flat graphics
- Emissive objects
- When lighting is not needed

### Phong Material

Classic Phong shading model with specular highlights.

```json
{
  "type": "phong",
  "color": "#ffffff",
  "specular": "#111111",
  "shininess": 30,
  "emissive": "#000000"
}
```

**Use cases:**
- Older rendering style
- Lower performance requirements
- Specific artistic looks

### Physical Material

Extended PBR material with additional properties like clearcoat and transmission.

```json
{
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0.5,
  "clearcoat": 1,
  "clearcoatRoughness": 0,
  "transmission": 0,
  "thickness": 0.5,
  "sheen": 0,
  "sheenColor": "#000000"
}
```

**Advanced Properties:**
- `clearcoat`: Clear coating layer (car paint effect)
- `clearcoatRoughness`: Clearcoat roughness
- `transmission`: Transparency/glass effect (0-1)
- `thickness`: Volume thickness for transmission
- `sheen`: Fabric/velvet effect

### Normal Material

Displays surface normals as RGB colors, useful for debugging.

```json
{
  "type": "normal"
}
```

### MatCap Material

Uses a matcap texture for lighting, very performant.

```json
{
  "type": "matcap",
  "matcap": {
    "url": "https://example.com/matcap.jpg"
  }
}
```

**Use cases:**
- Stylized rendering
- Fast rendering with baked lighting look
- Cartoon/cel-shaded styles

## Texture Mapping

All materials support various texture maps:

```json
{
  "type": "standard",
  "map": {
    "url": "https://example.com/texture.jpg",
    "wrapS": "repeat",
    "wrapT": "repeat",
    "repeat": [2, 2],
    "offset": [0, 0],
    "rotation": 0
  }
}
```

**Texture Properties:**
- `url`: Texture image URL
- `wrapS`, `wrapT`: `"repeat"`, `"clamp"`, or `"mirror"`
- `repeat`: Tiling [u, v]
- `offset`: UV offset [u, v]
- `rotation`: Rotation in radians

## Meshes

Meshes combine geometry and materials with transforms.

```json
{
  "id": "my-mesh",
  "name": "My Awesome Mesh",
  "geometry": { "type": "box", "width": 2, "height": 2, "depth": 2 },
  "material": { "type": "standard", "color": "#ff0000" },
  "position": [0, 0, 0],
  "rotation": [0, 0, 0],
  "scale": [1, 1, 1],
  "castShadow": true,
  "receiveShadow": true,
  "visible": true,
  "renderOrder": 0,
  "autoRotate": [0, 0.01, 0]
}
```

**Properties:**
- `position`: [x, y, z] world position
- `rotation`: [x, y, z] rotation in radians
- `scale`: [x, y, z] scale factors
- `castShadow`: Object casts shadows
- `receiveShadow`: Object receives shadows
- `visible`: Show/hide object
- `renderOrder`: Render order (higher = later)
- `autoRotate`: Rotation per frame [x, y, z]

## Animations

### Auto-Rotation

The `autoRotate` property animates rotation automatically:

```json
{
  "autoRotate": [0.01, 0.02, 0]
}
```

This rotates the mesh by [0.01, 0.02, 0] radians per frame. At 30fps:
- 0.01 rad/frame = 0.3 rad/sec = 17.2 deg/sec
- 0.02 rad/frame = 0.6 rad/sec = 34.4 deg/sec

**Rotation Tips:**
- X-axis: Pitch (nodding up/down)
- Y-axis: Yaw (turning left/right)
- Z-axis: Roll (tilting side to side)

### Layer Animations

Three layers support all standard layer animations:

```json
{
  "type": "three",
  "animations": [
    {
      "type": "entrance",
      "effect": "fadeIn",
      "duration": 30
    },
    {
      "type": "exit",
      "effect": "fadeOut",
      "duration": 30
    }
  ]
}
```

## Advanced Features

### Shadows

Enable shadow rendering:

```json
{
  "props": {
    "shadows": {
      "enabled": true,
      "type": "pcfsoft"
    }
  }
}
```

**Shadow Types:**
- `basic`: Hard shadows, fastest
- `pcf`: Percentage-Closer Filtering, smooth edges
- `pcfsoft`: Softer PCF shadows
- `vsm`: Variance Shadow Maps, very soft

Then enable on lights and meshes:
```json
{
  "lights": [
    {
      "type": "directional",
      "castShadow": true,
      "shadowMapSize": 2048
    }
  ],
  "meshes": [
    {
      "castShadow": true,
      "receiveShadow": true
    }
  ]
}
```

### Fog

Add atmospheric fog:

```json
{
  "fog": {
    "color": "#cccccc",
    "near": 10,
    "far": 50
  }
}
```

Objects fade to fog color between `near` and `far` distances.

### Tone Mapping

Control HDR tone mapping:

```json
{
  "toneMapping": {
    "type": "aces",
    "exposure": 1
  }
}
```

**Types:**
- `none`: No tone mapping
- `linear`: Linear tone mapping
- `reinhard`: Reinhard tone mapping
- `cineon`: Cineon/filmic
- `aces`: ACES Filmic (most cinematic)

### Background

Set scene background:

```json
{
  "background": "#1a1a2e"
}
```

Or use a texture:
```json
{
  "background": {
    "url": "https://example.com/skybox.jpg"
  }
}
```

## Best Practices

### Performance

1. **Optimize Geometry**
   - Use lower segment counts when possible
   - Combine static meshes when feasible
   - Use LOD (Level of Detail) for complex scenes

2. **Texture Optimization**
   - Use power-of-2 texture sizes (256, 512, 1024, 2048)
   - Compress textures (JPG for color, PNG for transparency)
   - Limit texture size to what's actually visible

3. **Lighting**
   - Limit real-time shadows (expensive)
   - Use ambient + 1-2 directional lights for best balance
   - Bake lighting when objects are static

4. **Materials**
   - Use `basic` material for non-lit objects
   - `standard` material is good balance of quality/performance
   - `physical` material is most expensive

### Lighting Setup

**Three-Point Lighting** (classic setup):

```json
{
  "lights": [
    {
      "type": "directional",
      "intensity": 1,
      "position": [5, 5, 5],
      "castShadow": true
    },
    {
      "type": "directional",
      "intensity": 0.3,
      "position": [-5, 3, -2]
    },
    {
      "type": "ambient",
      "intensity": 0.2
    }
  ]
}
```

**Product Lighting** (studio setup):

```json
{
  "lights": [
    {
      "type": "directional",
      "intensity": 1,
      "position": [10, 10, 5],
      "castShadow": true,
      "shadowMapSize": 2048
    },
    {
      "type": "hemisphere",
      "color": "#ffffff",
      "groundColor": "#888888",
      "intensity": 0.5
    }
  ]
}
```

### Common Coordinate System

- X-axis: Left (-) to Right (+)
- Y-axis: Down (-) to Up (+)
- Z-axis: Back (-) to Front (+)
- Rotation: Radians (2π = 360°)

## Troubleshooting

### Scene is black/nothing visible

**Causes & Solutions:**
- Check camera position and lookAt
- Verify lights are added (at minimum add ambient light)
- Check mesh positions are in camera view
- Verify material colors are not black
- Check layer size is reasonable

### Textures not loading

- Verify URLs are accessible
- Check CORS headers for external images
- Ensure texture sizes are power-of-2
- Check browser console for loading errors

### Shadows not appearing

- Enable shadows in props: `shadows: { enabled: true }`
- Set `castShadow: true` on lights
- Set `castShadow: true` and `receiveShadow: true` on meshes
- Increase `shadowMapSize` for better quality
- Check light position relative to objects

### Performance issues

- Reduce geometry segments
- Lower shadow map size
- Use fewer lights
- Optimize texture sizes
- Disable shadows if not needed
- Use simpler materials (basic instead of physical)

### GLTF models not showing

- Verify file format (GLB is recommended)
- Check model scale (might be too small/large)
- Verify file URL is accessible
- Check browser console for loading errors
- Try adjusting camera position

## Examples

See the `/examples/3d/` directory for complete working examples:

- `basic-rotating-cube/` - Simple rotating cube
- `product-showcase/` - Product visualization with studio lighting
- `multi-object-scene/` - Multiple objects with complex animations
- `text-3d/` - 3D text with dramatic lighting

## API Reference

See `/docs/api/three-types.md` for complete TypeScript type definitions.
