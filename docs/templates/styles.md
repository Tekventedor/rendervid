# Styling

Rendervid supports Tailwind-like styling properties and CSS classes.

## Layer Style Properties

```typescript
interface LayerStyle {
  // Spacing
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  margin?: string | number;
  marginX?: string | number;
  marginY?: string | number;

  // Borders
  borderRadius?: string | number;
  borderTopLeftRadius?: string | number;
  borderTopRightRadius?: string | number;
  borderBottomRightRadius?: string | number;
  borderBottomLeftRadius?: string | number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  // Shadows
  boxShadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string;

  // Backgrounds
  backgroundColor?: string;
  backgroundGradient?: BackgroundGradient;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  backgroundPosition?: string;
  backdropBlur?: 'sm' | 'md' | 'lg' | number;

  // Typography
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  textShadow?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Layout
  display?: 'flex' | 'grid' | 'block' | 'inline' | 'inline-flex' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string | number;

  // Effects
  blur?: 'sm' | 'md' | 'lg' | number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  saturate?: number;
  sepia?: number;
  hueRotate?: number;
  invert?: number;

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Raw CSS
  css?: CSSProperties;
}
```

## Spacing

### Padding

```json
{
  "style": {
    "padding": 16,
    "paddingX": 24,
    "paddingY": 12
  }
}
```

Individual sides:

```json
{
  "style": {
    "paddingTop": 20,
    "paddingRight": 16,
    "paddingBottom": 20,
    "paddingLeft": 16
  }
}
```

### Margin

```json
{
  "style": {
    "margin": 8,
    "marginX": 16,
    "marginY": 8
  }
}
```

## Borders

### Border Radius

```json
{
  "style": {
    "borderRadius": 12
  }
}
```

Presets: `'sm'`, `'md'`, `'lg'`, `'xl'`, `'full'`

```json
{
  "style": {
    "borderRadius": "lg"
  }
}
```

Individual corners:

```json
{
  "style": {
    "borderTopLeftRadius": 20,
    "borderTopRightRadius": 20,
    "borderBottomRightRadius": 0,
    "borderBottomLeftRadius": 0
  }
}
```

### Border Style

```json
{
  "style": {
    "borderWidth": 2,
    "borderColor": "#3B82F6",
    "borderStyle": "solid"
  }
}
```

## Shadows

### Box Shadow

```json
{
  "style": {
    "boxShadow": "lg"
  }
}
```

| Preset | Description |
|--------|-------------|
| `sm` | Small shadow |
| `md` | Medium shadow |
| `lg` | Large shadow |
| `xl` | Extra large shadow |
| `2xl` | Largest shadow |

Custom shadow:

```json
{
  "style": {
    "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.3)"
  }
}
```

## Backgrounds

### Solid Color

```json
{
  "style": {
    "backgroundColor": "#1E293B"
  }
}
```

### Gradient

```json
{
  "style": {
    "backgroundGradient": {
      "type": "linear",
      "from": "#3B82F6",
      "via": "#8B5CF6",
      "to": "#EC4899",
      "direction": 135
    }
  }
}
```

Gradient types: `'linear'`, `'radial'`, `'conic'`

### Background Image

```json
{
  "style": {
    "backgroundImage": "https://example.com/bg.jpg",
    "backgroundSize": "cover",
    "backgroundPosition": "center"
  }
}
```

### Backdrop Blur

```json
{
  "style": {
    "backdropBlur": "md",
    "backgroundColor": "rgba(255, 255, 255, 0.1)"
  }
}
```

## Typography

```json
{
  "style": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": 18,
    "fontWeight": "semibold",
    "lineHeight": 1.5,
    "letterSpacing": 0.5,
    "textAlign": "center",
    "textColor": "#FFFFFF",
    "textTransform": "uppercase",
    "textShadow": "0 2px 4px rgba(0,0,0,0.3)"
  }
}
```

### Font Weights

| Preset | Value |
|--------|-------|
| `thin` | 100 |
| `light` | 300 |
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |
| `black` | 900 |

## Layout

### Flexbox

```json
{
  "style": {
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "gap": 16
  }
}
```

### Grid

```json
{
  "style": {
    "display": "grid",
    "gap": 16,
    "css": {
      "gridTemplateColumns": "repeat(3, 1fr)"
    }
  }
}
```

## Effects

### Blur

```json
{
  "style": {
    "blur": "md"
  }
}
```

| Preset | Effect |
|--------|--------|
| `sm` | 4px blur |
| `md` | 8px blur |
| `lg` | 16px blur |

### Color Adjustments

```json
{
  "style": {
    "brightness": 110,
    "contrast": 105,
    "saturate": 120
  }
}
```

Values are percentages (100 = normal).

### Grayscale/Sepia

```json
{
  "style": {
    "grayscale": 50,
    "sepia": 30
  }
}
```

Values are 0-100.

## Raw CSS

For properties not covered by LayerStyle:

```json
{
  "style": {
    "css": {
      "transform": "perspective(1000px) rotateY(10deg)",
      "clipPath": "polygon(0 0, 100% 0, 100% 80%, 0 100%)",
      "WebkitBackgroundClip": "text"
    }
  }
}
```

## Tailwind Classes

Use `className` for Tailwind classes (when Tailwind is configured):

```json
{
  "className": "bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8"
}
```

## Complete Example

```json
{
  "id": "card",
  "type": "group",
  "position": { "x": 100, "y": 100 },
  "size": { "width": 400, "height": 300 },
  "props": { "clip": true },
  "style": {
    "backgroundColor": "rgba(255, 255, 255, 0.1)",
    "backdropBlur": "lg",
    "borderRadius": 20,
    "borderWidth": 1,
    "borderColor": "rgba(255, 255, 255, 0.2)",
    "boxShadow": "0 25px 50px rgba(0, 0, 0, 0.25)",
    "padding": 24
  },
  "children": [
    {
      "id": "card-title",
      "type": "text",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 352, "height": 40 },
      "props": { "text": "Glassmorphism Card" },
      "style": {
        "fontSize": 24,
        "fontWeight": "bold",
        "textColor": "#FFFFFF",
        "textShadow": "0 2px 4px rgba(0,0,0,0.2)"
      }
    },
    {
      "id": "card-body",
      "type": "text",
      "position": { "x": 0, "y": 60 },
      "size": { "width": 352, "height": 180 },
      "props": { "text": "This card uses glass morphism styling with backdrop blur and transparency." },
      "style": {
        "fontSize": 16,
        "lineHeight": 1.6,
        "textColor": "rgba(255, 255, 255, 0.8)"
      }
    }
  ]
}
```

## Style vs Props

Some properties exist in both `style` and `props`. Use:

- **`props`** for type-specific settings (text content, image src, shape type)
- **`style`** for visual styling that works across layer types

Example:

```json
{
  "type": "text",
  "props": {
    "text": "Hello",
    "fontSize": 48,
    "fontWeight": "bold"
  },
  "style": {
    "backgroundColor": "#1E293B",
    "padding": 16,
    "borderRadius": 8
  }
}
```

## Related Documentation

- [Layers](/templates/layers) - Layer types
- [Filters](/templates/filters) - Filter effects
- [Tailwind Guide](/guides/tailwind) - Using Tailwind CSS
