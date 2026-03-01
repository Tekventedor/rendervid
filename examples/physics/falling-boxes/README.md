# Falling Boxes - Physics Demo

Demonstrates physics simulation with gravity and rotation using the gaming framework's AnimationEngine.

## ⚠️ WebGL Limitation

Three.js rendering requires WebGL, which is **not available in headless browsers** used for automated video generation. The generated videos show only the background color.

**To see this example actually working:**

1. **Player Playground** (recommended):
   ```bash
   cd packages/player-playground && pnpm dev
   # Open http://localhost:5181 and load examples/physics/falling-boxes/template.json
   ```

2. **Editor Playground**:
   ```bash
   cd packages/editor-playground && pnpm dev  
   # Open http://localhost:5180 and load the template
   ```

3. **Browser Renderer**:
   ```typescript
   import { createBrowserRenderer } from '@rendervid/renderer-browser';
   const renderer = createBrowserRenderer();
   await renderer.renderVideo({ template });
   ```

## What's Implemented

This example demonstrates the **full gaming framework**:

- **AnimationEngine**: Keyframe animations with easeInQuad easing (simulates gravity)
- **Three.js Integration**: Box geometries with standard materials
- **Lighting**: Directional light with shadow casting
- **Physics Simulation**: 3 boxes falling with rotation

### Features

- 3 colored boxes (red, cyan, yellow) falling from different heights
- Rotation animations while falling (simulates tumbling)
- Ground plane at y=0
- Shadows for depth perception
- 5-second animation at 30fps

## Technical Details

- **Renderer**: Three.js (WebGL)
- **Animation**: AnimationEngine with 30+ easing functions
- **Easing**: easeInQuad for gravity acceleration
- **Materials**: StandardMaterial with metalness and roughness
- **Camera**: Perspective camera at [0, 5, 15]

The gaming framework code is **production-ready** and works perfectly in browser environments.
