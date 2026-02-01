# Filters

Apply CSS filter effects to layers.

## Filter Structure

```typescript
interface Filter {
  type: FilterType;
  value: number | string;
  animate?: FilterAnimation;
}

interface FilterAnimation {
  from: number;
  to: number;
  duration: number;
  easing?: string;
}

type FilterType =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'grayscale'
  | 'hue-rotate'
  | 'invert'
  | 'opacity'
  | 'saturate'
  | 'sepia'
  | 'drop-shadow';
```

## Available Filters

### Blur

Gaussian blur effect.

```json
{
  "filters": [
    { "type": "blur", "value": 5 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | No blur |
| `1-5` | Subtle blur |
| `5-15` | Medium blur |
| `15+` | Heavy blur |

### Brightness

Adjust brightness level.

```json
{
  "filters": [
    { "type": "brightness", "value": 1.2 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Completely dark |
| `0.5` | 50% brightness |
| `1` | Normal (default) |
| `1.5` | 50% brighter |
| `2` | 100% brighter |

### Contrast

Adjust contrast level.

```json
{
  "filters": [
    { "type": "contrast", "value": 1.5 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Completely gray |
| `0.5` | Low contrast |
| `1` | Normal (default) |
| `1.5` | High contrast |
| `2` | Very high contrast |

### Grayscale

Convert to grayscale.

```json
{
  "filters": [
    { "type": "grayscale", "value": 100 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Full color |
| `50` | 50% grayscale |
| `100` | Complete grayscale |

### Hue Rotate

Rotate the color hue.

```json
{
  "filters": [
    { "type": "hue-rotate", "value": 90 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | No rotation |
| `90` | 90 degree rotation |
| `180` | Inverted hues |
| `360` | Full rotation (same as 0) |

### Invert

Invert colors.

```json
{
  "filters": [
    { "type": "invert", "value": 100 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Normal |
| `50` | 50% inverted |
| `100` | Fully inverted |

### Opacity

Adjust opacity (alternative to layer opacity).

```json
{
  "filters": [
    { "type": "opacity", "value": 0.5 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Transparent |
| `0.5` | 50% opacity |
| `1` | Fully opaque |

### Saturate

Adjust color saturation.

```json
{
  "filters": [
    { "type": "saturate", "value": 2 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Desaturated (grayscale) |
| `1` | Normal (default) |
| `2` | Double saturation |
| `3` | Triple saturation |

### Sepia

Apply sepia tone.

```json
{
  "filters": [
    { "type": "sepia", "value": 80 }
  ]
}
```

| Value | Result |
|-------|--------|
| `0` | Normal |
| `50` | 50% sepia |
| `100` | Full sepia |

### Drop Shadow

Add a drop shadow.

```json
{
  "filters": [
    { "type": "drop-shadow", "value": "4px 4px 10px rgba(0,0,0,0.5)" }
  ]
}
```

Format: `offsetX offsetY blur color`

## Combining Filters

Apply multiple filters to a layer:

```json
{
  "id": "vintage-photo",
  "type": "image",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 600, "height": 400 },
  "props": { "src": "photo.jpg", "fit": "cover" },
  "filters": [
    { "type": "sepia", "value": 50 },
    { "type": "contrast", "value": 1.2 },
    { "type": "brightness", "value": 0.9 }
  ]
}
```

## Animated Filters

Animate filter values over time:

### Fade from Blur

```json
{
  "filters": [
    {
      "type": "blur",
      "value": 0,
      "animate": {
        "from": 20,
        "to": 0,
        "duration": 30,
        "easing": "easeOutCubic"
      }
    }
  ]
}
```

### Brightness Pulse

```json
{
  "filters": [
    {
      "type": "brightness",
      "value": 1,
      "animate": {
        "from": 1,
        "to": 1.5,
        "duration": 30,
        "easing": "easeInOutSine"
      }
    }
  ]
}
```

### Color to Grayscale

```json
{
  "filters": [
    {
      "type": "grayscale",
      "value": 100,
      "animate": {
        "from": 0,
        "to": 100,
        "duration": 60,
        "easing": "linear"
      }
    }
  ]
}
```

## Complete Example

```json
{
  "id": "hero-image",
  "type": "image",
  "position": { "x": 0, "y": 0 },
  "size": { "width": 1920, "height": 1080 },
  "props": {
    "src": "https://example.com/hero.jpg",
    "fit": "cover"
  },
  "filters": [
    {
      "type": "blur",
      "value": 0,
      "animate": {
        "from": 15,
        "to": 0,
        "duration": 45,
        "easing": "easeOutQuad"
      }
    },
    {
      "type": "brightness",
      "value": 1,
      "animate": {
        "from": 0.5,
        "to": 1,
        "duration": 45,
        "easing": "easeOutQuad"
      }
    }
  ],
  "animations": [
    {
      "type": "keyframe",
      "duration": 300,
      "keyframes": [
        { "frame": 0, "properties": { "scaleX": 1, "scaleY": 1 } },
        { "frame": 300, "properties": { "scaleX": 1.1, "scaleY": 1.1 } }
      ]
    }
  ]
}
```

## Filter Presets

Common filter combinations:

### Vintage

```json
{
  "filters": [
    { "type": "sepia", "value": 40 },
    { "type": "contrast", "value": 1.1 },
    { "type": "brightness", "value": 0.95 },
    { "type": "saturate", "value": 0.9 }
  ]
}
```

### Cinematic

```json
{
  "filters": [
    { "type": "contrast", "value": 1.2 },
    { "type": "brightness", "value": 0.9 },
    { "type": "saturate", "value": 0.85 }
  ]
}
```

### Dramatic

```json
{
  "filters": [
    { "type": "contrast", "value": 1.4 },
    { "type": "brightness", "value": 0.85 },
    { "type": "saturate", "value": 1.3 }
  ]
}
```

### Dream

```json
{
  "filters": [
    { "type": "blur", "value": 2 },
    { "type": "brightness", "value": 1.1 },
    { "type": "saturate", "value": 1.2 }
  ]
}
```

### Black & White

```json
{
  "filters": [
    { "type": "grayscale", "value": 100 },
    { "type": "contrast", "value": 1.1 }
  ]
}
```

## Best Practices

1. **Use subtle values** - Heavy filters can look unprofessional
2. **Animate transitions** - Smooth filter changes look better than instant
3. **Combine thoughtfully** - 2-3 filters usually suffice
4. **Consider performance** - Blur is computationally expensive
5. **Test on target output** - Filters may render differently in video vs preview

## Related Documentation

- [Layers](/templates/layers) - Layer types
- [Animations](/templates/animations) - Animation system
- [Styles](/templates/styles) - Styling options
