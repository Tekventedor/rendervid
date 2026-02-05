# Product Showcase

Professional product visualization example demonstrating advanced Three.js features including studio lighting, real-time shadows, and physically-based rendering.

## Preview

![Preview](./preview.gif)

[View full video (video.mp4)](./video.mp4)

## Features

- Studio lighting setup (key light, fill light, rim light, accent light)
- Physically-based rendering (PBR) with Physical material
- Real-time soft shadows (PCF Soft)
- HDR tone mapping (ACES Filmic)
- Product rotation animation
- Floor and backdrop for context
- Professional UI overlay with call-to-action

## Usage

```bash
pnpm run examples:render 3d/product-showcase
```

With custom inputs:

```bash
pnpm run examples:render 3d/product-showcase -- \
  --input productName="My Amazing Product" \
  --input productColor="#ff6b6b"
```

## Template Configuration

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `productName` | string | "Premium Product" | Product display name |
| `productColor` | color | `#4c00ff` | Product material color |

### Three.js Scene Setup

**Camera:**
- Type: Perspective
- FOV: 50 degrees (less distortion for product shots)
- Position: [0, 2, 8]
- Looking at: Origin [0, 0, 0]

**Lighting (Four-Point Setup):**

1. Key Light (Directional)
   - Position: [10, 10, 5]
   - Intensity: 1.5
   - Casts shadows with 2048x2048 shadow map

2. Fill Light (Directional)
   - Position: [-5, 5, -5]
   - Intensity: 0.5
   - Softens shadows on dark side

3. Environment Light (Hemisphere)
   - Sky color: White
   - Ground color: Gray
   - Intensity: 0.6
   - Provides ambient base lighting

4. Accent Light (Point)
   - Position: [3, 2, 3]
   - Color: Purple (#4c00ff)
   - Intensity: 0.8
   - Adds color accent and depth

**Meshes:**

1. Product (Sphere)
   - High-poly sphere (64x32 segments)
   - Physical material with clearcoat
   - Metalness: 0.9, Roughness: 0.1
   - Auto-rotating on Y-axis

2. Floor (Plane)
   - 20x20 units
   - Standard material
   - Receives shadows

3. Backdrop (Plane)
   - Behind the product
   - Provides clean background

**Rendering Settings:**
- Shadows: Enabled (PCF Soft for smooth edges)
- Tone Mapping: ACES Filmic with 1.2 exposure
- Anti-aliasing: Enabled

## Customization Ideas

### Use a GLTF Model

Replace the sphere geometry with your own 3D model:

```json
{
  "id": "product",
  "geometry": {
    "type": "gltf",
    "url": "./assets/product.glb",
    "scale": 1
  }
}
```

### Different Material Looks

Glass product:
```json
"material": {
  "type": "physical",
  "color": "#ffffff",
  "metalness": 0,
  "roughness": 0,
  "transmission": 1,
  "thickness": 0.5
}
```

Matte plastic:
```json
"material": {
  "type": "standard",
  "color": "#4c00ff",
  "metalness": 0,
  "roughness": 0.8
}
```

Chrome metal:
```json
"material": {
  "type": "physical",
  "color": "#ffffff",
  "metalness": 1,
  "roughness": 0.05
}
```

### Camera Orbit Animation

Currently the product rotates. To make the camera orbit instead:

```json
"camera": {
  "type": "perspective",
  "fov": 50,
  "position": [0, 2, 8]
}
```

Then add custom animation logic or use the autoRotate feature on a parent group.

### Add Environment Map

For realistic reflections, add an environment map:

```json
"material": {
  "type": "physical",
  "envMap": {
    "url": "https://example.com/environment.hdr"
  },
  "envMapIntensity": 1.5
}
```

## Lighting Techniques

### Three-Point Lighting

The classic setup (used in this example):
- Key light: Main light source
- Fill light: Reduces harsh shadows
- Rim/accent light: Separates subject from background

### Studio Lighting Ratios

Adjust intensities for different moods:

Dramatic (high contrast):
```
Key: 2.0, Fill: 0.3, Ambient: 0.2
```

Balanced (this example):
```
Key: 1.5, Fill: 0.5, Ambient: 0.6
```

Soft/even:
```
Key: 1.0, Fill: 0.8, Ambient: 0.8
```

## Performance Tips

1. Optimize shadow map size based on quality needs:
   - 1024: Good for most cases
   - 2048: High quality (used here)
   - 4096: Maximum quality (slow)

2. Reduce geometry segments if performance is an issue:
   ```json
   "widthSegments": 32,
   "heightSegments": 16
   ```

3. Use basic materials for floor/backdrop if they're not featured:
   ```json
   "material": { "type": "basic", "color": "#f0f0f0" }
   ```

## Technical Details

- Duration: 8 seconds at 30fps (240 frames)
- Resolution: 1920x1080 (Full HD)
- Shadows: PCF Soft (high quality, smooth edges)
- Tone mapping: ACES Filmic (cinematic look)
- Material: Physical (most advanced PBR material)

## GLTF Model Sources

To use your own 3D models, you can get them from:

- [Sketchfab](https://sketchfab.com/) (many free models)
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)
- Create your own in Blender, Maya, 3ds Max, etc.

Export as GLB (binary GLTF) for best compatibility.

## Related Examples

- [Basic Rotating Cube](/examples/3d/basic-rotating-cube/) - Simple Three.js introduction
- [Multi-Object Scene](/examples/3d/multi-object-scene/) - Multiple meshes
- [Text 3D](/examples/3d/text-3d/) - 3D text rendering
