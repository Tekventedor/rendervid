# Podcast Episode Promo

> Square format podcast episode promotion with cover art, animated sound wave bars, episode details, guest info, and streaming platform badges.

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
| `showName` | string | `"THE CREATIVE HOUR"` | Show Name *(required)* |
| `episodeNumber` | string | `"47"` | Episode Number |
| `episodeTitle` | string | `"Design Systems That Scale"` | Episode Title *(required)* |
| `guestName` | string | `"Marcus Chen"` | Guest Name |
| `coverArt` | url | `"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop"` | Podcast Cover Art |
| `accentColor` | color | `"#10b981"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social/podcast-episode"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "showName": "THE CREATIVE HOUR",
    "episodeNumber": "47",
    "episodeTitle": "Design Systems That Scale"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
