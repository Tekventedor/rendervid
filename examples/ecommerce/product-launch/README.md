# Product Launch

Dramatic new product announcement with video background and reveal animation.

## Preview
![Preview](./preview.gif)

## Features

- Dynamic video background layer
- Radial gradient overlay for text readability
- Animated text reveals with scale and slide effects
- Customizable product name, tagline, and launch date

## Usage
```bash
pnpm run examples:render ecommerce/product-launch
```

## Inputs
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `backgroundVideo` | video | No | ./background.mp4 |
| `productName` | string | Yes | NEXUS PRO |
| `tagline` | string | No | The future of productivity is here |
| `launchDate` | string | No | Available March 15, 2024 |

## Custom Video Background

```bash
pnpm run examples:render ecommerce/product-launch \
  --input backgroundVideo="https://example.com/my-video.mp4" \
  --input productName="MY PRODUCT"
```

## Included Assets

- `background.mp4` - Sample abstract background video
