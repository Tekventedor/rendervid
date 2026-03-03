# Dashboard with Multiple Components

> Demonstrates using multiple custom components in a single template

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |
| **Custom Components** | Counter, ProgressBar, Badge, MetricCard |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `usersCount` | number | `1247` | Users Count |
| `revenueAmount` | number | `98765` | Revenue |
| `conversionRate` | number | `87` | Conversion Rate % |

## Usage

```bash
# Render this example
node examples/render-all.mjs "custom-components/dashboard"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "usersCount": 1247,
    "revenueAmount": 98765,
    "conversionRate": 87
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
