# Asteroid Battle - Space Combat Example

A complex 3D space battle scene demonstrating advanced Three.js capabilities in RenderVid. Inspired by classic arcade space shooters, this example showcases a rich game scene with multiple objects, dynamic lighting, and a full game HUD overlay.

## Preview

![Preview](preview.gif)

## Scene Contents

### Player Ship
- **Body** — Metallic fuselage box with emissive shading
- **Cockpit** — Blue-tinted canopy with strong emissive glow
- **Wings** — Left and right delta wings
- **Engine glow** — 3 emissive cylinders (main + wing engines) with blue flame effect

### Enemy Squadron
- **4 enemy ships** — Hexagonal cone geometry with red/orange emissive material and `autoRotate` tumbling motion

### Environment
- **Planet** — Large blue sphere with slow rotation, positioned in the distant background
- **Orbital ring** — Semi-transparent torus encircling the planet
- **Moon** — Gray sphere orbiting the planet
- **5 Asteroids** — Low-poly spheres (widthSegments: 6-8) with rough rocky textures

### Explosion Debris
- **5 glowing debris pieces** — Small box geometries with orange/red emissive materials, rapidly tumbling

### Lighting
- **Ambient** — Deep blue-space ambient (very dim, `#0a0f2a`)
- **Directional (Sun)** — Warm sunlight from upper-right (`#fffadc`, intensity 1.8)
- **Point (Engine)** — Blue engine exhaust glow near player ship
- **Point (Explosion)** — Orange explosion light at debris location
- **Point (Enemy)** — Red enemy threat indicator

### Game HUD Overlay
- **HULL / SHIELD / ENERGY bars** — Status bars with gradient fills
- **SCORE / KILLS / WAVE** — Score panel in top-right corner
- **Tactical Radar** — Circular radar with player and 4 enemy blips
- **Crosshair** — Central targeting reticle with inner/outer rings
- **Warning banner** — "ENEMY CONTACT DETECTED" alert with fade-in animation
- **Title + Subtitle** — "ASTEROID BATTLE" title with glowing text shadow

## Technical Details

- **Resolution**: 3840×2160 (4K UHD)
- **Duration**: 10 seconds @ 30 FPS (300 frames)
- **Renderer**: React Three Fiber + Three.js via SwiftShader WebGL
- **Tone Mapping**: ACES Filmic (exposure 1.2)
- **Antialiasing**: Enabled

## How to Render

```bash
cd examples/3d/asteroid-battle
tsx render.ts
```

Output files:
- `video.mp4` — 4K video at 16Mbps (software-encoded for maximum quality)
- `preview.gif` — Animated preview at 960px width, 15 FPS
- `preview-Xs.png` — Still frames at 1s, 3s, 5s, 8s

## Three.js Features Demonstrated

| Feature | Details |
|---------|---------|
| Multiple mesh types | Box, Cone, Sphere, Cylinder, Torus |
| PBR materials | `metalness`, `roughness`, `emissive`, `emissiveIntensity` |
| Transparent materials | `transparent: true`, `opacity: 0.55` for planet ring |
| `autoRotate` | Per-axis rotation for asteroids, enemies, planet, debris |
| Multiple lights | Ambient + Directional + 3 Point lights |
| ACES tone mapping | Cinematic color grading |
| 2D HUD overlay | HTML shape/text layers composited over 3D scene |

## Customization

Edit `template.json` to customize:
- Player ship color and position
- Number of enemies and their positions
- Asteroid sizes and placements
- HUD values (score, shield percentage, etc.)
- Camera field of view and position

## Notes

- The 3D scene uses **world-space units**, not pixels — all mesh positions/sizes are in meters
- The HUD uses **screen-space pixels** (doubled for 4K: 3840×2160)
- `autoRotate` values are radians per frame (e.g., `0.02` ≈ 1.15°/frame ≈ 34°/sec at 30 FPS)
- Rendering at 4K with software encoding takes ~5-10 minutes
