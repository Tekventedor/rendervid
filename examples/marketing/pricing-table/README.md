# Pricing Table

> Animated pricing comparison with 3 tiers and staggered entrance animations.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `headerTitle` | string | `"Choose Your Plan"` | Header Title *(required)* |
| `tier1Name` | string | `"Starter"` | Tier 1 Name *(required)* |
| `tier1Price` | string | `"$9/mo"` | Tier 1 Price *(required)* |
| `tier2Name` | string | `"Professional"` | Tier 2 Name *(required)* |
| `tier2Price` | string | `"$29/mo"` | Tier 2 Price *(required)* |
| `tier3Name` | string | `"Enterprise"` | Tier 3 Name *(required)* |
| `tier3Price` | string | `"$99/mo"` | Tier 3 Price *(required)* |
| `primaryColor` | color | `"#3b82f6"` | Primary Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "marketing/pricing-table"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "headerTitle": "Choose Your Plan",
    "tier1Name": "Starter",
    "tier1Price": "$9/mo"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
