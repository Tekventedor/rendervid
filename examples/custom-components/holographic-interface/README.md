# Holographic Interface

> Futuristic holographic interface with multiple animated elements

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 12s |
| **FPS** | 60 |
| **Output** | Video (MP4) |
| **Custom Components** | HexagonGrid, DataStream, CircularProgress, HolographicText, RadarScan |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `systemName` | string | `"NEXUS SYSTEM"` | System Name |
| `statusText` | string | `"ONLINE"` | Status |
| `completionPercent` | number | `87` | Completion Percentage |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/holographic-interface"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "systemName": "NEXUS SYSTEM",
    "statusText": "ONLINE",
    "completionPercent": 87
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
