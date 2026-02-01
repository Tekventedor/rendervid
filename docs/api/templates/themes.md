# Themes

Pre-built color schemes and design tokens for consistent styling.

## Available Themes

### Modern Theme

Clean, professional design for business content.

```typescript
import { modernTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#3B82F6` |
| Secondary | `#8B5CF6` |
| Background | `#0F172A` |
| Surface | `#1E293B` |
| Text | `#F8FAFC` |
| Font | Inter |

### Minimal Theme

Simple and clean design with focus on content.

```typescript
import { minimalTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#18181B` |
| Secondary | `#71717A` |
| Background | `#FFFFFF` |
| Surface | `#F4F4F5` |
| Text | `#18181B` |
| Font | SF Pro Display |

### Bold Theme

High-energy design for impactful content.

```typescript
import { boldTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#FF3366` |
| Secondary | `#FFCC00` |
| Background | `#0A0A0A` |
| Surface | `#1A1A1A` |
| Text | `#FFFFFF` |
| Font | Poppins |

### Elegant Theme

Sophisticated design for premium content.

```typescript
import { elegantTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#C9A962` (Gold) |
| Secondary | `#8B7355` |
| Background | `#1A1A1A` |
| Surface | `#2A2A2A` |
| Text | `#F5F5F5` |
| Font | Playfair Display |

### Tech Theme

Futuristic design for technology content.

```typescript
import { techTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#00D4FF` (Cyan) |
| Secondary | `#7B61FF` |
| Background | `#0D0D0D` |
| Surface | `#161616` |
| Text | `#E0E0E0` |
| Font | Orbitron |

### Nature Theme

Organic design inspired by nature.

```typescript
import { natureTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#22C55E` (Green) |
| Secondary | `#84CC16` |
| Background | `#F0FDF4` |
| Surface | `#DCFCE7` |
| Text | `#14532D` |
| Font | Quicksand |

### Sunset Theme

Warm gradient design for vibrant content.

```typescript
import { sunsetTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#F97316` (Orange) |
| Secondary | `#EC4899` |
| Background | `#1F1020` |
| Surface | `#2D1B2E` |
| Text | `#FFF7ED` |
| Font | Sora |

### Ocean Theme

Cool blue design inspired by the sea.

```typescript
import { oceanTheme } from '@rendervid/templates';
```

| Property | Value |
|----------|-------|
| Primary | `#0EA5E9` (Sky Blue) |
| Secondary | `#06B6D4` |
| Background | `#0C1929` |
| Surface | `#132F4C` |
| Text | `#E0F2FE` |
| Font | Outfit |

### Dark Theme

Default dark mode for all content types.

```typescript
import { darkTheme } from '@rendervid/templates';
```

### Light Theme

Default light mode for all content types.

```typescript
import { lightTheme } from '@rendervid/templates';
```

## Theme Structure

### ThemeColors

```typescript
interface ThemeColors {
  primary: string;      // Main brand color
  secondary: string;    // Accent color
  background: string;   // Page background
  surface: string;      // Card/container background
  text: string;         // Primary text color
  textMuted: string;    // Secondary text color
  success: string;      // Success state
  warning: string;      // Warning state
  error: string;        // Error state
  gradient: string[];   // Gradient colors
}
```

### ThemeTypography

```typescript
interface ThemeTypography {
  fontFamily: string;       // Body font
  headingFamily: string;    // Heading font
  monoFamily: string;       // Monospace font
  baseFontSize: number;     // Base size in pixels
  sizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
}
```

### ThemeSpacing

```typescript
interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}
```

### ThemeAnimation

```typescript
interface ThemeAnimation {
  duration: number;     // Default duration in frames
  fast: number;         // Fast animation duration
  slow: number;         // Slow animation duration
  stagger: number;      // Stagger delay between items
  easing: string;       // Default easing function
}
```

## Using Themes

### Get Theme by Name

```typescript
import { getTheme, themes } from '@rendervid/templates';

const theme = getTheme('modern');

// Or access directly
const modernTheme = themes.modern;
```

### Apply Theme to Template

```typescript
import { getTheme } from '@rendervid/templates';

const theme = getTheme('sunset');

const template = {
  name: 'Themed Video',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [],
  composition: {
    scenes: [{
      id: 'main',
      startFrame: 0,
      endFrame: 150,
      backgroundColor: theme.colors.background,
      layers: [
        {
          id: 'title',
          type: 'text',
          position: { x: 160, y: 440 },
          size: { width: 1600, height: 200 },
          props: {
            text: 'Hello World',
            fontFamily: theme.typography.headingFamily,
            fontSize: theme.typography.sizes['5xl'],
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            textAlign: 'center',
          },
          animations: [{
            type: 'entrance',
            effect: 'fadeInUp',
            duration: theme.animation.duration,
            easing: theme.animation.easing,
          }],
        },
        {
          id: 'subtitle',
          type: 'text',
          position: { x: 160, y: 600 },
          size: { width: 1600, height: 100 },
          props: {
            text: 'A themed video',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.sizes['2xl'],
            color: theme.colors.textMuted,
            textAlign: 'center',
          },
          animations: [{
            type: 'entrance',
            effect: 'fadeIn',
            delay: theme.animation.stagger,
            duration: theme.animation.duration,
          }],
        },
      ],
    }],
  },
};
```

### Create Custom Theme

```typescript
import type { Theme } from '@rendervid/templates';
import { modernTheme } from '@rendervid/templates';

// Extend an existing theme
const customTheme: Theme = {
  ...modernTheme,
  name: 'Custom',
  description: 'My custom theme',
  colors: {
    ...modernTheme.colors,
    primary: '#FF5500',
    secondary: '#00AAFF',
  },
};

// Use in templates
const template = {
  // ... use customTheme.colors, etc.
};
```

### Theme-Based Gradients

```typescript
const theme = getTheme('sunset');

const gradientBackground = {
  id: 'bg',
  type: 'shape',
  position: { x: 0, y: 0 },
  size: { width: 1920, height: 1080 },
  props: {
    shape: 'rectangle',
    gradient: {
      type: 'linear',
      colors: theme.colors.gradient.map((color, i, arr) => ({
        offset: i / (arr.length - 1),
        color,
      })),
      angle: 135,
    },
  },
};
```

## Related Documentation

- [Themes Overview](/api/templates/overview) - Package overview
- [Scene Templates](/api/templates/scenes) - Pre-built scenes
- [Styles](/templates/styles) - Styling reference
