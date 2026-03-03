# Music Album Release

> Square format album release announcement with album art, pulsing glow effects, artist info, and streaming platform badges.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `artistName` | string | `"AURORA WAVES"` | Artist Name *(required)* |
| `albumTitle` | string | `"Midnight Echoes"` | Album Title *(required)* |
| `albumArt` | url | `"https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&h=800&fit=crop"` | Album Artwork |
| `accentColor` | color | `"#f43f5e"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social/music-album-release"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "artistName": "AURORA WAVES",
    "albumTitle": "Midnight Echoes",
    "albumArt": "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&h=800&fit=crop"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
