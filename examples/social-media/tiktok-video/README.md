# TikTok Video

Vertical video with trendy multi-scene animations for TikTok.

## Preview

![Preview](preview.gif)

## Features

- 9:16 aspect ratio (1080x1920)
- 3-scene structure (hook, main, reveal)
- Scene transitions
- TikTok-style colors
- 8-second duration

## Inputs

| Key | Type | Required | Default |
|-----|------|----------|---------|
| `hookText` | string | Yes | "Wait for it..." |
| `mainText` | string | Yes | "The secret is..." |
| `revealText` | string | Yes | "Consistency!" |
| `handle` | string | No | "@yourtiktok" |
| `primaryColor` | color | No | #00f2ea |
| `secondaryColor` | color | No | #ff0050 |

## Quick Start

```bash
pnpm run examples:render social-media/tiktok-video
```
