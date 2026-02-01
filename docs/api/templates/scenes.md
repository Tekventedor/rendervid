# Scene Templates

Pre-built scene templates for common video patterns.

## Using Scene Templates

All scene templates follow the same interface:

```typescript
const scene = SceneTemplate.generate({
  inputs: { /* scene-specific inputs */ },
  theme?: Theme,           // Optional theme
  startFrame?: number,     // Start frame (default: 0)
  duration?: number,       // Duration in frames
  aspectRatio?: AspectRatio,
});
```

## Intro Scenes

### TitleReveal

Animated title reveal with optional subtitle.

```typescript
import { TitleReveal, getTheme } from '@rendervid/templates';

const scene = TitleReveal.generate({
  inputs: {
    title: 'Welcome',
    subtitle: 'To our presentation',
    alignment: 'center',  // 'left' | 'center' | 'right'
  },
  theme: getTheme('modern'),
  startFrame: 0,
  duration: 90,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | Yes | - |
| `subtitle` | string | No | - |
| `alignment` | string | No | `'center'` |

### LogoReveal

Animated logo reveal.

```typescript
import { LogoReveal, getTheme } from '@rendervid/templates';

const scene = LogoReveal.generate({
  inputs: {
    logoUrl: 'https://example.com/logo.png',
    tagline: 'Your tagline here',
    animation: 'scale',  // 'scale' | 'fade' | 'slide'
  },
  theme: getTheme('minimal'),
  startFrame: 0,
  duration: 60,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `logoUrl` | string | Yes | - |
| `tagline` | string | No | - |
| `animation` | string | No | `'scale'` |

## Lower Thirds

### ModernLowerThird

News-style name/title card.

```typescript
import { ModernLowerThird, getTheme } from '@rendervid/templates';

const scene = ModernLowerThird.generate({
  inputs: {
    name: 'John Smith',
    title: 'CEO, Acme Corp',
    position: 'bottom-left',  // 'bottom-left' | 'bottom-right'
  },
  theme: getTheme('modern'),
  startFrame: 30,
  duration: 120,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `name` | string | Yes | - |
| `title` | string | No | - |
| `position` | string | No | `'bottom-left'` |

## Data Visualization

### AnimatedStats

Animated statistics display.

```typescript
import { AnimatedStats, getTheme } from '@rendervid/templates';

const scene = AnimatedStats.generate({
  inputs: {
    stats: [
      { value: 1000, label: 'Users', suffix: '+' },
      { value: 99.9, label: 'Uptime', suffix: '%' },
      { value: 50, label: 'Countries', prefix: '' },
    ],
    layout: 'horizontal',  // 'horizontal' | 'vertical' | 'grid'
  },
  theme: getTheme('tech'),
  startFrame: 0,
  duration: 90,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `stats` | StatItem[] | Yes | - |
| `layout` | string | No | `'horizontal'` |

**StatItem:**
```typescript
interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}
```

## Quotes

### TestimonialQuote

Customer testimonial display.

```typescript
import { TestimonialQuote, getTheme } from '@rendervid/templates';

const scene = TestimonialQuote.generate({
  inputs: {
    quote: 'This product changed my life!',
    author: 'Jane Doe',
    role: 'Customer',
    avatarUrl: 'https://example.com/avatar.jpg',
    rating: 5,
  },
  theme: getTheme('elegant'),
  startFrame: 0,
  duration: 150,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `quote` | string | Yes | - |
| `author` | string | Yes | - |
| `role` | string | No | - |
| `avatarUrl` | string | No | - |
| `rating` | number | No | - |

## Call to Action

### CallToAction

Action prompt with button.

```typescript
import { CallToAction, getTheme } from '@rendervid/templates';

const scene = CallToAction.generate({
  inputs: {
    headline: 'Ready to get started?',
    subtext: 'Sign up today and get 50% off',
    buttonText: 'Start Free Trial',
    url: 'https://example.com/signup',
  },
  theme: getTheme('bold'),
  startFrame: 0,
  duration: 90,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `headline` | string | Yes | - |
| `subtext` | string | No | - |
| `buttonText` | string | Yes | - |
| `url` | string | No | - |

## Events

### CountdownTimer

Event countdown display.

```typescript
import { CountdownTimer, getTheme } from '@rendervid/templates';

const scene = CountdownTimer.generate({
  inputs: {
    title: 'Launch Day',
    days: 7,
    hours: 12,
    minutes: 30,
    seconds: 0,
    showLabels: true,
  },
  theme: getTheme('tech'),
  startFrame: 0,
  duration: 90,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | No | - |
| `days` | number | No | 0 |
| `hours` | number | No | 0 |
| `minutes` | number | No | 0 |
| `seconds` | number | No | 0 |
| `showLabels` | boolean | No | true |

## Products

### ProductShowcase

Product feature display.

```typescript
import { ProductShowcase, getTheme } from '@rendervid/templates';

const scene = ProductShowcase.generate({
  inputs: {
    productName: 'Widget Pro',
    productImage: 'https://example.com/product.png',
    price: '$99.99',
    features: ['Fast', 'Reliable', 'Easy to use'],
    badge: 'New',
  },
  theme: getTheme('modern'),
  startFrame: 0,
  duration: 120,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `productName` | string | Yes | - |
| `productImage` | string | Yes | - |
| `price` | string | No | - |
| `features` | string[] | No | [] |
| `badge` | string | No | - |

## Text Animation

### KineticText

Dynamic text animation.

```typescript
import { KineticText, getTheme } from '@rendervid/templates';

const scene = KineticText.generate({
  inputs: {
    text: 'Think Different',
    style: 'typewriter',  // 'typewriter' | 'bounce' | 'wave' | 'split'
    emphasis: 'Different',  // Word to emphasize
  },
  theme: getTheme('minimal'),
  startFrame: 0,
  duration: 90,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `text` | string | Yes | - |
| `style` | string | No | `'typewriter'` |
| `emphasis` | string | No | - |

## Transitions

### WipeTransition

Scene wipe transition effect.

```typescript
import { WipeTransition, getTheme } from '@rendervid/templates';

const scene = WipeTransition.generate({
  inputs: {
    direction: 'left',  // 'left' | 'right' | 'up' | 'down'
    color: '#000000',
  },
  theme: getTheme('modern'),
  startFrame: 0,
  duration: 30,
});
```

**Inputs:**
| Input | Type | Required | Default |
|-------|------|----------|---------|
| `direction` | string | No | `'left'` |
| `color` | string | No | Theme background |

## Scene Discovery

### Get All Templates

```typescript
import { sceneTemplates } from '@rendervid/templates';

Object.entries(sceneTemplates).forEach(([name, template]) => {
  console.log(`${name}: ${template.description}`);
  console.log(`  Category: ${template.category}`);
  console.log(`  Tags: ${template.tags.join(', ')}`);
});
```

### Search Templates

```typescript
import { searchScenes, getScenesByCategory } from '@rendervid/templates';

// By category
const introScenes = getScenesByCategory('intro');

// By search term
const productScenes = searchScenes('product');

// By tag
const animatedScenes = searchScenes('animated');
```

### Categories

Available categories:
- `intro` - Title and logo reveals
- `lower-third` - Name cards
- `data` - Statistics and charts
- `quote` - Testimonials
- `cta` - Call to action
- `event` - Countdowns and dates
- `product` - Product showcases
- `text` - Text animations
- `transition` - Scene transitions
- `social` - Social media formats

## Complete Example

```typescript
import {
  getTheme,
  TitleReveal,
  ProductShowcase,
  TestimonialQuote,
  CallToAction,
} from '@rendervid/templates';

const theme = getTheme('sunset');

const scenes = [
  // Intro
  TitleReveal.generate({
    inputs: { title: 'Introducing', subtitle: 'Widget Pro' },
    theme,
    startFrame: 0,
    duration: 90,
  }),

  // Product
  ProductShowcase.generate({
    inputs: {
      productName: 'Widget Pro',
      productImage: 'https://example.com/widget.png',
      features: ['10x Faster', 'Zero Config', 'Free Updates'],
    },
    theme,
    startFrame: 90,
    duration: 150,
  }),

  // Testimonial
  TestimonialQuote.generate({
    inputs: {
      quote: 'Best product I\'ve ever used!',
      author: 'Happy Customer',
      rating: 5,
    },
    theme,
    startFrame: 240,
    duration: 120,
  }),

  // CTA
  CallToAction.generate({
    inputs: {
      headline: 'Get Widget Pro Today',
      buttonText: 'Buy Now - $99',
    },
    theme,
    startFrame: 360,
    duration: 90,
  }),
];

const template = {
  name: 'Product Launch Video',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 15 },
  inputs: [],
  composition: { scenes },
};
```

## Related Documentation

- [Themes](/api/templates/themes) - Theme reference
- [Templates Overview](/api/templates/overview) - Package overview
- [Animations](/templates/animations) - Animation reference
