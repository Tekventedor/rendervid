# YouTube Subscribe Lower Third

> Transparent lower third with channel avatar, name, subscriber count and animated subscribe button

## Preview

*Run `node examples/render-all.mjs` to generate the preview GIF and MP4.*

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1920 × 1080 |
| **Duration** | 6s |
| **FPS** | 30 |
| **Output** | Video (MP4) |
| **Custom Components** | LowerThird |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `channelName` | string | `"FlowHunt"` | Channel Name *(required)* |
| `subscriberCount` | string | `"202 subscribers"` | Subscriber Count *(required)* |
| `avatarUrl` | url | `"https://yt3.googleusercontent.com/nq4JoCO94W0R6672Mlnla3SZcO83IAaM12lh36O942v1NnHRGWo55dTyqWqaY0vv6sm_k8K7FQ=s240-c-k-c0x00ffffff-no-rj"` | Avatar URL *(required)* |
| `videoTitle` | string | `""` | Video Title |

## Usage

```bash
# Render this example
node examples/render-all.mjs "youtube-lower-third"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "channelName": "FlowHunt",
    "subscriberCount": "202 subscribers",
    "avatarUrl": "https://yt3.googleusercontent.com/nq4JoCO94W0R6672Mlnla3SZcO83IAaM12lh36O942v1NnHRGWo55dTyqWqaY0vv6sm_k8K7FQ=s240-c-k-c0x00ffffff-no-rj"
  }
}
```

---

*Part of the [RenderVid examples](../README.md) · [RenderVid](../../README.md)*
