# Examples

Ready-to-use templates demonstrating Rendervid capabilities.

## Quick Start Examples

### Hello World

The simplest Rendervid template - animated text on a colored background.

```json
{
  "name": "Hello World",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3 },
  "inputs": [
    { "key": "message", "type": "string", "label": "Message", "required": true, "default": "Hello, World!" }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#1a1a2e",
      "layers": [{
        "id": "message",
        "type": "text",
        "position": { "x": 160, "y": 440 },
        "size": { "width": 1600, "height": 200 },
        "inputKey": "message",
        "props": {
          "fontSize": 96,
          "fontWeight": "bold",
          "color": "#ffffff",
          "textAlign": "center"
        },
        "animations": [
          { "type": "entrance", "effect": "fadeIn", "duration": 30 },
          { "type": "emphasis", "effect": "pulse", "delay": 45, "duration": 30 }
        ]
      }]
    }]
  }
}
```

[View full example](/examples/basic-video)

## Example Categories

### Social Media

Ready-to-use templates for social platforms:

| Template | Dimensions | Platform |
|----------|------------|----------|
| Instagram Story | 1080x1920 | Instagram Stories |
| Instagram Post | 1080x1080 | Instagram Feed |
| TikTok Video | 1080x1920 | TikTok |
| YouTube Thumbnail | 1280x720 | YouTube |
| Twitter Card | 1200x630 | Twitter/X |
| LinkedIn Banner | 1584x396 | LinkedIn |

[View social media examples](/examples/social-media)

### Marketing

| Template | Description |
|----------|-------------|
| Product Showcase | Feature product with details |
| Sale Announcement | Promotional sale video |
| Testimonial Video | Customer testimonial |
| Before & After | Comparison slider |
| Logo Reveal | Animated logo |
| Pricing Table | 3-tier pricing |

### Data Visualization

| Template | Description |
|----------|-------------|
| Animated Bar Chart | Rising bars with data |
| Line Graph | Animated trend line |
| Pie Chart | Segment reveal |
| Counter Animation | Number counting up |
| Progress Dashboard | Multiple progress bars |

[View data visualization examples](/examples/data-visualization)

### E-commerce

| Template | Description |
|----------|-------------|
| Flash Sale | Urgency countdown |
| Product Launch | New product announcement |
| Product Comparison | Side-by-side |
| Discount Reveal | Promo code animation |

### Events

| Template | Description |
|----------|-------------|
| Event Countdown | Days/hours/minutes |
| Save the Date | Elegant invitation |
| Webinar Promo | Speaker + topic |
| Conference Intro | Speaker card |

### Content Creation

| Template | Description |
|----------|-------------|
| Podcast Teaser | Episode preview |
| Blog Promo | Article promotion |
| Quote Card | Inspirational quote |
| News Headline | Breaking news |

### Showcase

Feature demonstrations:

| Template | Description |
|----------|-------------|
| All Animations | 25+ entrance, exit, emphasis |
| All Easing | 31 easing functions |
| All Filters | 10 filter effects |
| All Shapes | 5 shape types |
| All Transitions | 5 scene transitions |
| All Layer Types | 8 layer types |

## Running Examples

### List Available Examples

```bash
cd rendervid
pnpm run examples:list
```

### Render an Example

```bash
pnpm run examples:render getting-started/01-hello-world
```

### Render with Custom Output

```bash
pnpm run examples:render instagram-story --output ./my-video.mp4 --format mp4
```

### Validate Templates

```bash
pnpm run examples:validate
```

## Example Structure

Each example follows this structure:

```
example-name/
├── template.json       # The Rendervid template
├── render.ts           # Render script
├── README.md           # Documentation
├── preview.gif         # Animated preview (videos)
├── preview.png         # Static preview (images)
└── assets/             # Optional assets
    └── logo.svg
```

## Creating Your Own Examples

1. **Copy a starter template:**
   ```bash
   cp -r examples/getting-started/01-hello-world examples/my-example
   ```

2. **Edit `template.json`** with your design

3. **Test the template:**
   ```bash
   pnpm run examples:render my-example
   ```

4. **Generate preview:**
   ```bash
   pnpm run examples:generate-previews my-example
   ```

## Next Steps

- [Basic Video Tutorial](/examples/basic-video)
- [Social Media Templates](/examples/social-media)
- [Data Visualization](/examples/data-visualization)
- [Custom Components](/examples/custom-component)
