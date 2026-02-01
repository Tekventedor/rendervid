# @rendervid/templates

Pre-built themes and scene templates for rapid development.

## Import

```typescript
import {
  // Themes
  themes,
  getTheme,
  modernTheme,
  minimalTheme,
  boldTheme,

  // Scene templates
  TitleReveal,
  LogoReveal,
  ProductShowcase,
  // ... more scenes

  // Utilities
  sceneTemplates,
  getSceneTemplate,
  getScenesByCategory,
} from '@rendervid/templates';
```

## Themes

### Available Themes

| Theme | Description |
|-------|-------------|
| `modern` | Clean, professional design |
| `minimal` | Simple and focused |
| `bold` | High-energy, impactful |
| `elegant` | Sophisticated, luxurious |
| `tech` | Futuristic, digital |
| `nature` | Organic, calming |
| `sunset` | Warm, vibrant gradients |
| `ocean` | Cool blue tones |
| `dark` | Default dark mode |
| `light` | Default light mode |

### Using Themes

```typescript
import { getTheme, themes } from '@rendervid/templates';

// Get a specific theme
const theme = getTheme('modern');

// Access theme colors
theme.colors.primary;     // '#3B82F6'
theme.colors.background;  // '#0F172A'

// Access typography
theme.typography.fontFamily;  // 'Inter, system-ui, sans-serif'
theme.typography.sizes['3xl']; // 30

// Access animation defaults
theme.animation.duration;  // 30
theme.animation.easing;    // 'easeInOutCubic'

// List all themes
Object.keys(themes);  // ['modern', 'minimal', 'bold', ...]
```

### Theme Structure

```typescript
interface Theme {
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: Record<string, number | string>;
  shadows: Record<string, string>;
  animation: ThemeAnimation;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
  gradient: string[];
}
```

## Scene Templates

### Available Scene Templates

| Template | Category | Description |
|----------|----------|-------------|
| `TitleReveal` | Intro | Animated title reveal |
| `LogoReveal` | Intro | Logo animation |
| `ModernLowerThird` | Lower Third | News-style name card |
| `SocialPromo` | Social | Social media promo |
| `AnimatedStats` | Data | Animated statistics |
| `TestimonialQuote` | Quote | Customer testimonial |
| `CallToAction` | CTA | Action button/link |
| `CountdownTimer` | Event | Countdown display |
| `ProductShowcase` | Product | Product feature card |
| `KineticText` | Text | Dynamic text animation |
| `WipeTransition` | Transition | Scene wipe effect |

### Using Scene Templates

```typescript
import { TitleReveal, getTheme } from '@rendervid/templates';

const theme = getTheme('modern');

// Generate a scene
const scene = TitleReveal.generate({
  inputs: {
    title: 'Welcome',
    subtitle: 'To our presentation',
  },
  theme,
  startFrame: 0,
  duration: 90,
});

// Use in a template
const template = {
  name: 'My Video',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 3 },
  inputs: [],
  composition: {
    scenes: [scene],
  },
};
```

### Scene Template Interface

```typescript
interface SceneTemplate {
  name: string;
  description: string;
  category: SceneCategory;
  tags: string[];
  inputs: SceneTemplateInput[];
  aspectRatios: AspectRatio[];
  generate: (options: SceneGenerateOptions) => Scene;
}

interface SceneGenerateOptions {
  inputs: Record<string, unknown>;
  theme?: Theme;
  startFrame?: number;
  duration?: number;
  aspectRatio?: AspectRatio;
}
```

## Scene Discovery

### Get All Templates

```typescript
import { sceneTemplates, getScenesByCategory } from '@rendervid/templates';

// Get all scene templates
Object.keys(sceneTemplates);
// ['TitleReveal', 'LogoReveal', 'ModernLowerThird', ...]

// Get by category
const introScenes = getScenesByCategory('intro');
// [TitleReveal, LogoReveal]

const socialScenes = getScenesByCategory('social');
// [SocialPromo]
```

### Search Templates

```typescript
import { searchScenes, getSceneTags } from '@rendervid/templates';

// Search by keyword
const results = searchScenes('product');
// [ProductShowcase]

// Get all tags
const tags = getSceneTags();
// ['intro', 'title', 'logo', 'social', 'stats', ...]
```

## Standard Resolutions

```typescript
import { aspectRatioResolutions, getResolution } from '@rendervid/templates';

// Get resolution for aspect ratio
const res = getResolution('16:9');
// { width: 1920, height: 1080 }

const story = getResolution('9:16');
// { width: 1080, height: 1920 }

// All resolutions
aspectRatioResolutions;
// {
//   '16:9': { width: 1920, height: 1080 },
//   '9:16': { width: 1080, height: 1920 },
//   '1:1': { width: 1080, height: 1080 },
//   '4:5': { width: 1080, height: 1350 },
//   '4:3': { width: 1440, height: 1080 },
// }
```

## Example: Building a Video

```typescript
import {
  getTheme,
  TitleReveal,
  ProductShowcase,
  CallToAction,
  aspectRatioResolutions,
} from '@rendervid/templates';
import { RendervidEngine } from '@rendervid/core';

// Setup
const engine = new RendervidEngine();
const theme = getTheme('modern');
const resolution = aspectRatioResolutions['16:9'];

// Build scenes
const introScene = TitleReveal.generate({
  inputs: { title: 'New Product', subtitle: 'Coming Soon' },
  theme,
  startFrame: 0,
  duration: 90,
});

const productScene = ProductShowcase.generate({
  inputs: {
    productName: 'Widget Pro',
    productImage: 'https://example.com/widget.png',
    features: ['Fast', 'Reliable', 'Easy'],
  },
  theme,
  startFrame: 90,
  duration: 150,
});

const ctaScene = CallToAction.generate({
  inputs: {
    text: 'Buy Now',
    url: 'https://example.com',
    buttonText: 'Shop',
  },
  theme,
  startFrame: 240,
  duration: 60,
});

// Assemble template
const template = {
  name: 'Product Launch',
  output: {
    type: 'video',
    ...resolution,
    fps: 30,
    duration: 10,
  },
  inputs: [],
  composition: {
    scenes: [introScene, productScene, ctaScene],
  },
};

// Validate
const validation = engine.validateTemplate(template);
console.log('Valid:', validation.valid);
```

## Related Documentation

- [Themes](/api/templates/themes) - Theme reference
- [Scene Templates](/api/templates/scenes) - Scene reference
- [Template Schema](/templates/schema) - Full template reference
