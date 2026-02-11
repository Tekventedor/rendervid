# Basic Rotating Cube

A simple example demonstrating the Three.js layer with a rotating 3D cube.

## Preview

![Preview](./preview.gif)

[View animated SVG](preview.svg)

[View full video (video.mp4)](./video.mp4)

## Features

- Three.js layer with perspective camera
- Box geometry with PBR material
- Ambient and directional lighting
- Auto-rotation animation
- Customizable colors
- Entrance animation

## Usage

Run this example using the render script:

```bash
pnpm run examples:render 3d/basic-rotating-cube
```

Or using the Node.js renderer directly:

```typescript
import { NodeRenderer } from '@rendervid/renderer-node';
import template from './template.json';

const renderer = new NodeRenderer();
await renderer.renderVideo(template, {
  outputPath: './output.mp4',
  hardwareAcceleration: { enabled: false },
  bitrate: '8M',
});
```

## Template Configuration

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `cubeColor` | color | `#ff6b6b` | Color of the cube |
| `backgroundColor` | color | `#1a1a2e` | Background color |

### Three.js Layer Configuration

**Camera:**
- Type: Perspective
- FOV: 75 degrees
- Position: [0, 0, 5]

**Lights:**
- Ambient light (intensity: 0.5)
- Directional light (intensity: 1, position: [5, 5, 5])

**Mesh:**
- Geometry: Box (2x2x2)
- Material: Standard PBR material
- Metalness: 0.3
- Roughness: 0.4
- Auto-rotation: [0.01, 0.02, 0] radians per frame

## Customization Ideas

### Change rotation speed

Modify the `autoRotate` property:

```json
"autoRotate": [0.02, 0.04, 0]  // Faster rotation
"autoRotate": [0.005, 0.01, 0] // Slower rotation
```

### Add more dramatic lighting

Change the directional light:

```json
{
  "type": "directional",
  "intensity": 2,
  "position": [10, 10, 5]
}
```

### Make it metallic

Increase metalness:

```json
"material": {
  "type": "standard",
  "color": "#4c00ff",
  "metalness": 0.9,
  "roughness": 0.1
}
```

### Add shadows

Enable shadow casting:

```json
"props": {
  "shadows": {
    "enabled": true,
    "type": "pcfsoft"
  },
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

## Technical Details

- Duration: 5 seconds at 30fps (150 frames)
- Resolution: 1920x1080 (Full HD)
- Layer type: `three`
- Geometry type: `box`
- Material type: `standard`

## Related Examples

- [Product Showcase](/examples/3d/product-showcase/) - Advanced lighting and camera setup
- [Multi-Object Scene](/examples/3d/multi-object-scene/) - Multiple meshes and animations
- [Text 3D](/examples/3d/text-3d/) - 3D text rendering
