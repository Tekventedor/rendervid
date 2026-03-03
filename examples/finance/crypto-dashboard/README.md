# Crypto Dashboard

> Modern fintech cryptocurrency market dashboard with live-style price cards, volume stats, and trending indicators. Dark theme with vibrant accent colors.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 7s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `coin1Name` | string | `"BTC"` | Coin 1 Name *(required)* |
| `coin1Price` | string | `"$67,432.18"` | Coin 1 Price *(required)* |
| `coin1Change` | string | `"+3.42%"` | Coin 1 Change % *(required)* |
| `coin2Name` | string | `"ETH"` | Coin 2 Name *(required)* |
| `coin2Price` | string | `"$3,891.05"` | Coin 2 Price *(required)* |
| `coin2Change` | string | `"+1.87%"` | Coin 2 Change % *(required)* |
| `coin3Name` | string | `"SOL"` | Coin 3 Name *(required)* |
| `coin3Price` | string | `"$189.24"` | Coin 3 Price *(required)* |
| `coin3Change` | string | `"-2.15%"` | Coin 3 Change % *(required)* |
| `volume` | string | `"$142.8B"` | 24H Volume |
| `date` | string | `"FEB 10, 2026"` | Date |

## Usage

```bash
# Render this example
node examples/render-all.mjs "finance/crypto-dashboard"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "coin1Name": "BTC",
    "coin1Price": "$67,432.18",
    "coin1Change": "+3.42%"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
