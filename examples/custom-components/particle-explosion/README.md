# Particle Explosion Effect

> Stunning particle explosion with physics simulation using custom component

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 5s |
| **FPS** | 60 |
| **Output** | Video (MP4) |
| **Custom Components** | ParticleExplosion, GlowingTitle |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `title` | string | `"PARTICLE EXPLOSION"` | Title Text |
| `particleCount` | number | `150` | Number of Particles |
| `explosionForce` | number | `8` | Explosion Force |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/particle-explosion"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "title": "PARTICLE EXPLOSION",
    "particleCount": 150,
    "explosionForce": 8
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
