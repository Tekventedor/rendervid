# Crypto Dashboard

Modern fintech cryptocurrency market dashboard with live-style price cards, volume stats, and trending indicators.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Modern fintech cryptocurrency market dashboard with live-style price cards, volume stats, and trending indicators. Dark theme with vibrant accent colors.

## Features

- 1920x1080 (16:9)
- Three cryptocurrency price cards with color-coded change indicators
- Dark theme with green, indigo, and red accent colors
- Live indicator with pulsing animation and 24H volume display
- 7-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| coin1Name | string | BTC | Coin 1 Name |
| coin1Price | string | $67,432.18 | Coin 1 Price |
| coin1Change | string | +3.42% | Coin 1 Change % |
| coin2Name | string | ETH | Coin 2 Name |
| coin2Price | string | $3,891.05 | Coin 2 Price |
| coin2Change | string | +1.87% | Coin 2 Change % |
| coin3Name | string | SOL | Coin 3 Name |
| coin3Price | string | $189.24 | Coin 3 Price |
| coin3Change | string | -2.15% | Coin 3 Change % |
| volume | string | $142.8B | 24H Volume |
| date | string | FEB 10, 2026 | Date |

## Quick Start

```bash
pnpm run examples:render finance/crypto-dashboard
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 7 seconds
