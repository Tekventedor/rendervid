# HEVC Encoding

Demonstrates H.265/HEVC encoding with Rendervid for high-quality, efficient video output.

## Features

- HEVC/H.265 software encoding via libx265
- Hardware-accelerated HEVC encoding (NVENC, VideoToolbox, QSV, AMF)
- Apple/QuickTime compatibility with hvc1 tag
- Configurable CRF quality and presets

## Usage

```bash
pnpm run examples:render advanced/hevc-encoding
```

## Codec Options

| Option | Description | Default |
|--------|-------------|---------|
| `codec` | `'hevc'` or `'libx265'` | `'libx264'` |
| `quality` | CRF value (0-51, lower = better) | 28 for HEVC |
| `preset` | Encoding speed/quality tradeoff | `'medium'` |
| `bitrate` | Target bitrate (overrides CRF) | - |

## HEVC vs H.264

HEVC provides roughly 50% better compression at the same visual quality compared to H.264. The default CRF for HEVC is 28 (visually equivalent to H.264 CRF 23).

## Hardware Acceleration

When using HEVC with GPU encoding, Rendervid automatically selects the appropriate HEVC hardware encoder:

| GPU Vendor | Encoder |
|------------|---------|
| NVIDIA | `hevc_nvenc` |
| Apple | `hevc_videotoolbox` |
| Intel | `hevc_qsv` |
| AMD | `hevc_amf` |
