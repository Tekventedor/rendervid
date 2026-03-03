# App Feature Showcase

> Vertical format app feature showcase with phone mockup frame, feature callout cards, and gradient background. Perfect for Instagram and TikTok.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1920 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `appName` | string | `"FlowSync"` | App Name *(required)* |
| `feature1` | string | `"Real-time Collaboration"` | Feature 1 |
| `feature2` | string | `"Smart Notifications"` | Feature 2 |
| `feature3` | string | `"Cloud Sync Everywhere"` | Feature 3 |
| `screenshotUrl` | url | `"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=800&fit=crop"` | App Screenshot |
| `accentColor` | color | `"#a855f7"` | Accent Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "social/app-feature-showcase"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "appName": "FlowSync",
    "feature1": "Real-time Collaboration",
    "feature2": "Smart Notifications"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
