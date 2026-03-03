# Tech Startup Hero

> A bold, modern SaaS-style hero video with gradient backgrounds, decorative shapes, badge pill, headline, feature bullets, and a call-to-action button. Perfect for product launches, landing pages, and startup pitch videos.

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
| `badgeText` | string | `"LAUNCHING SOON"` | Badge Text |
| `headline` | string | `"Ship faster with\nAI-powered workflows"` | Headline *(required)* |
| `feature1` | string | `"Automated CI/CD pipelines in minutes"` | Feature 1 |
| `feature2` | string | `"Real-time collaboration across teams"` | Feature 2 |
| `feature3` | string | `"Enterprise-grade security built in"` | Feature 3 |
| `ctaText` | string | `"Get Early Access"` | CTA Button Text |
| `primaryColor` | color | `"#6366f1"` | Primary Color |
| `secondaryColor` | color | `"#8b5cf6"` | Secondary Color |

## Usage

```bash
# Render this example
node examples/render-all.mjs "tech/startup-hero"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "badgeText": "LAUNCHING SOON",
    "headline": "Ship faster with\nAI-powered workflows",
    "feature1": "Automated CI/CD pipelines in minutes"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
