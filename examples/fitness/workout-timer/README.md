# Workout Timer

> Exercise interval timer with workout name and countdown.

## Preview

![Preview](preview.gif)

**[📥 Download MP4](output.mp4)**

---

## Details

| Property | Value |
|----------|-------|
| **Resolution** | 1080 × 1920 |
| **Duration** | 8s |
| **FPS** | 30 |
| **Output** | Video (MP4) |

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `roundLabel` | string | `"ROUND 3 OF 5"` | Round Label |
| `exerciseName` | string | `"BURPEES"` | Exercise Name *(required)* |
| `timerDisplay` | string | `"0:45"` | Timer Display *(required)* |
| `nextExercise` | string | `"Mountain Climbers"` | Next Exercise |

## Usage

```bash
# Render this example
node examples/render-all.mjs "fitness/workout-timer"

# Or render all examples
node examples/render-all.mjs
```

Customize inputs via the MCP server or by editing `template.json`:

```json
{
  "inputs": {
    "roundLabel": "ROUND 3 OF 5",
    "exerciseName": "BURPEES",
    "timerDisplay": "0:45"
  }
}
```

---

*Part of the [RenderVid examples](../../README.md) · [RenderVid](../../../README.md)*
